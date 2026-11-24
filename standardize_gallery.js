const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/* =====================================
   SETTINGS
===================================== */

const OUTPUT_DIR = "images/gallery";

// Where the ORIGINAL photos are. The first folder that exists and contains photos is used.
const SOURCE_CANDIDATES = [
  "../serenity-originals-backup/images/gallery", // originals moved out of the repo
  "images/gallery",                               // originals still inside the repo
];

const CANVAS = {
  landscape: { width: 1600, height: 1200 }, // 4:3
  portrait:  { width: 1200, height: 1600 }, // 3:4
};

const BACKGROUND = "#141d26"; // same as the gallery background, so padding is invisible
const QUALITY = 78;
const DEFAULT_MODE = "pad";   // "pad" | "crop" | "blur"

/* =====================================
   PER-PHOTO OVERRIDES
   Key = folder/filename without extension, e.g. "caskets/casket-3"
   Options:
     mode:     "pad"  = keep the whole photo, add background around it
               "crop" = fill the canvas, trim the edges
               "blur" = keep the whole photo, fill the space with a blurred copy
     canvas:   "landscape" | "portrait"   (force a canvas)
     position: for crop only: "top" | "bottom" | "left" | "right" | "centre" | "attention"
===================================== */

const OVERRIDES = {
  // "caskets/casket-3": { mode: "crop", position: "top" },
  // "flowers/flower-2": { mode: "blur" },
  // "chapel/chapel-4":  { canvas: "portrait" },
};

/* =====================================
   SCRIPT (you shouldn't need to edit below)
===================================== */

const IS_PHOTO = /\.(jpe?g|png)$/i;
const overrides = Object.fromEntries(
  Object.entries(OVERRIDES).map(([key, value]) => [key.toLowerCase(), value])
);
const usedOverrides = new Set();

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function findSource() {
  for (const dir of SOURCE_CANDIDATES) {
    if (!fs.existsSync(dir)) continue;
    if ([...walk(dir)].some((file) => IS_PHOTO.test(file))) return dir;
  }
  return null;
}

async function standardize(file, source) {
  const rel = path
    .relative(source, file)
    .replace(/\\/g, "/")
    .replace(IS_PHOTO, "");

  const key = rel.toLowerCase();
  const opts = overrides[key] || {};
  if (overrides[key]) usedOverrides.add(key);

  // Work out the photo's real shape (phones store rotation in EXIF data)
  const meta = await sharp(file).metadata();
  const rotated = meta.orientation && meta.orientation >= 5;
  const photoWidth = rotated ? meta.height : meta.width;
  const photoHeight = rotated ? meta.width : meta.height;

  const orientation = opts.canvas || (photoHeight > photoWidth ? "portrait" : "landscape");
  const { width, height } = CANVAS[orientation];
  const mode = opts.mode || DEFAULT_MODE;

  let pipeline;

  if (mode === "crop") {
    pipeline = sharp(file)
      .rotate()
      .flatten({ background: BACKGROUND })
      .resize({ width, height, fit: "cover", position: opts.position || "centre" });
  } else {
    // Keep the whole photo (never enlarged), then place it on the canvas
    const photo = await sharp(file)
      .rotate()
      .resize({ width, height, fit: "inside", withoutEnlargement: true })
      .toBuffer();

    let base;
    if (mode === "blur") {
      const blurred = await sharp(file)
        .rotate()
        .flatten({ background: BACKGROUND })
        .resize({ width, height, fit: "cover" })
        .blur(30)
        .modulate({ brightness: 0.55 })
        .toBuffer();
      base = sharp(blurred);
    } else {
      base = sharp({ create: { width, height, channels: 3, background: BACKGROUND } });
    }

    pipeline = base.composite([{ input: photo, gravity: "centre" }]);
  }

  const out = path.join(OUTPUT_DIR, rel + ".webp");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const info = await pipeline.webp({ quality: QUALITY }).toFile(out);

  const small = Math.max(photoWidth, photoHeight) < 1000;
  console.log(
    `${rel.padEnd(28)} ${orientation}/${mode}`.padEnd(48) +
      `${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB` +
      (small ? `   ⚠ small original (${photoWidth}x${photoHeight}), may look soft` : "")
  );

  return info.size;
}

(async () => {
  const source = findSource();
  if (!source) {
    console.error("No original photos found. Checked:\n  " + SOURCE_CANDIDATES.join("\n  "));
    process.exit(1);
  }
  console.log(`Reading originals from: ${source}\n`);

  let count = 0;
  let total = 0;
  for (const file of walk(source)) {
    if (!IS_PHOTO.test(file)) continue;
    total += await standardize(file, source);
    count++;
  }

  console.log(`\nDone: ${count} photos, ${Math.round(total / 1024)} KB total.`);

  for (const key of Object.keys(overrides)) {
    if (!usedOverrides.has(key)) {
      console.log(`⚠ Override "${key}" didn't match any photo. Check the spelling.`);
    }
  }
})();