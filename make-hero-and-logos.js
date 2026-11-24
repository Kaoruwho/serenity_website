// Run from your website folder:  node make-hero-and-logos.js
const sharp = require("sharp");

const BACKUP = "../serenity-originals-backup/images";
const OUT = "images";

const HERO_SRC = `${BACKUP}/services/serenity_hero_natural_2x.jpg`;
const WEBP = { quality: 62, effort: 6 };
const AVIF = { quality: 45, effort: 5 };

const LOGOS = [
  ["serenity_logo_cropped-removebg-preview", [264, 528]], // header: shown ~264px wide
  ["serenity_logo_cropped-white", [200, 400]],            // footer: shown ~200px wide
];

(async () => {
  // Hero: four widths, in AVIF and WebP
  for (const width of [800, 1200, 1600, 2400]) {
    const base = sharp(HERO_SRC).resize({ width, withoutEnlargement: true });
    await base.clone().webp(WEBP).toFile(`${OUT}/services/serenity_hero_natural_${width}.webp`);
    await base.clone().avif(AVIF).toFile(`${OUT}/services/serenity_hero_natural_${width}.avif`);
    console.log("hero", width);
  }

  // Hero for phones: portrait crop
  const phone = sharp(HERO_SRC).resize(900, 1500, { fit: "cover", position: "centre" });
  await phone.clone().webp(WEBP).toFile(`${OUT}/services/serenity_hero_mobile.webp`);
  await phone.clone().avif(AVIF).toFile(`${OUT}/services/serenity_hero_mobile.avif`);
  console.log("hero mobile");

  // Logos: a normal and a 2x version of each
  for (const [name, widths] of LOGOS) {
    for (const width of widths) {
      await sharp(`${BACKUP}/${name}.png`)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(`${OUT}/${name}-${width}.webp`);
      console.log("logo", name, width);
    }
  }
  console.log("Done.");
})();