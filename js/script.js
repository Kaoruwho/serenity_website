'use strict';
// Navigation stays usable without JS thanks to native <details>.
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.mobile-navigation');
  if (menu) {
    menu.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') menu.open = false; });
    document.addEventListener('click', event => { if (menu.open && !menu.contains(event.target)) menu.open = false; });
  }

  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  // Gentle one-time reveals; respects device reduced-motion preferences.
  /* =====================================
   STAGGERED SCROLL REVEAL
===================================== */

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!reduceMotion && "IntersectionObserver" in window) {

  const revealGroups = [
    ".promise__editorial > *",
    ".promise__aside > *",
    ".section-heading > div > *",
    ".section-heading > p",
    ".service-accordion > .service-panel",
    ".credentials__copy > *",
    ".credentials__action",
    ".contact__intro > *",
    ".contact__inquiry"
  ];

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.07,
      rootMargin: "0px 0px 30px 0px"
    }
  );

  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {

      el.classList.add("reveal");

      el.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 0.15, 0.6)}s`
      );

      revealObserver.observe(el);
    });
  });

  document.body.classList.add("js-motion");
}

/* =====================================
   SERVICES ACCORDION + CASKET GALLERY
===================================== */

const servicePanels = document.querySelectorAll(".service-panel");

const casketGallery = document.getElementById("casketGallery");
const casketGalleryImage = document.getElementById(
  "casketGalleryImage"
);
const casketGalleryPlaceholder = document.getElementById(
  "casketGalleryPlaceholder"
);
const casketGalleryTitle = document.getElementById(
  "casketGalleryTitle"
);
const casketGalleryEyebrow = document.getElementById(
  "casketGalleryEyebrow"
);
const casketGalleryPlaceholderText = document.getElementById(
  "casketGalleryPlaceholderText"
);
const casketGalleryCounter = document.getElementById(
  "casketGalleryCounter"
);

const casketGalleryPrev = document.getElementById(
  "casketGalleryPrev"
);
const casketGalleryNext = document.getElementById(
  "casketGalleryNext"
);
const closeCasketGallery = document.getElementById(
  "closeCasketGallery"
);

const serviceGalleries = {
  chapel: {
    service: "Chapel & Viewing",
    title: "Chapel & Viewing",   
    eyebrow: "SERENITY / CHAPEL & VIEWING",
    placeholder: "Our chapel and viewing spaces will be displayed here.",
    items: [
      {
        title: "Main Viewing Chapel",
        image: "images/gallery/chapel/chapel-1.webp"
      },
      {
        title: "Interior Chapel",
        image: "images/gallery/chapel/chapel-2.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/chapel/chapel-3.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/chapel/chapel-4.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/chapel/chapel-5.webp"
      }
      
    ]
  },

  flowers: {
    service: "Floral Arrangements",
    title: "Floral Arrangements",
    eyebrow: "SERENITY / FLORAL COLLECTION",
    placeholder: "Our floral arrangements will be displayed here.",
    items: [
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-1.webp"
      },
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-2.webp"
      },
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-3.webp"
      },
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-4.webp"
      },
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-5.webp"
      },
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-6.webp"
      },
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-7.webp"
      },
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-8.webp"
      },
      {
        title: "Flower Arrangements",
        image: "images/gallery/flowers/flower-9.webp"
      }
    ]
  },

  caskets: {
    service: "Caskets & Memorial Products",
    title: "Casket Collection",
    eyebrow: "SERENITY / CASKET COLLECTION",
    placeholder: "Our casket photographs will be displayed here.",
    items: [
      {
        title: "Main Viewing Chapel",
        image: "images/gallery/caskets/casket-1.webp"
      },
      {
        title: "Interior Chapel",
        image: "images/gallery/caskets/casket-2.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/caskets/casket-3.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/caskets/casket-4.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/caskets/casket-5.webp"
      }
    ]
  },

  care: {
    service: "Mortuary Care",
    title: "Mortuary Care",
    eyebrow: "SERENITY / MORTUARY CARE",
    placeholder: "Our mortuary care facilities and services will be displayed here.",
    items: [
      {
        title: "Main Viewing Chapel",
        image: "images/gallery/mortuary/chapel-1.webp"
      },
      {
        title: "Interior Chapel",
        image: "images/gallery/mortuary/chapel-2.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/mortuary/chapel-3.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/mortuary/chapel-4.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/mortuary/chapel-5.webp"
      }
    ]
  },

  coordination: {
    service: "Funeral Coordination",
    title: "Funeral Coordination",
    eyebrow: "SERENITY / FUNERAL COORDINATION",
    placeholder: "Our funeral coordination services will be displayed here.",
    items: [
      {
        title: "Main Viewing Chapel",
        image: "images/gallery/coordination/chapel-1.webp"
      },
      {
        title: "Interior Chapel",
        image: "images/gallery/coordination/chapel-2.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/coordination/chapel-3.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/coordination/chapel-4.webp"
      },
      {
        title: "Viewing Area",
        image: "images/gallery/coordination/chapel-5.webp"
      }
    ]
  }
};

let activeGallery = null;
let currentCasketIndex = 0;
let galleryCloseTimer = null;

function showCasketItem(index) {
  if (!activeGallery) return;

  const items = activeGallery.items;

  if (items.length === 0) {
    casketGalleryImage.hidden = true;
    casketGalleryImage.removeAttribute("src");

    casketGalleryPlaceholder.hidden = false;

    casketGalleryPlaceholderText.textContent =
      activeGallery.placeholder;

    casketGalleryTitle.textContent =
      activeGallery.title;

    casketGalleryCounter.textContent = "0 / 0";

    casketGalleryPrev.disabled = true;
    casketGalleryNext.disabled = true;

    return;
  }

  currentCasketIndex =
    (index + items.length) % items.length;

  const item = items[currentCasketIndex];

  casketGalleryTitle.textContent = item.title;

  casketGalleryCounter.textContent =
    `${currentCasketIndex + 1} / ${items.length}`;

  casketGalleryPrev.disabled = items.length <= 1;
  casketGalleryNext.disabled = items.length <= 1;

  casketGalleryImage.hidden = true;
  casketGalleryPlaceholder.hidden = false;

  casketGalleryPlaceholderText.textContent =
    activeGallery.placeholder;

  casketGalleryImage.onload = () => {
    casketGalleryImage.hidden = false;
    casketGalleryPlaceholder.hidden = true;
  };

  casketGalleryImage.onerror = () => {
    casketGalleryImage.hidden = true;
    casketGalleryPlaceholder.hidden = false;

    casketGalleryPlaceholderText.textContent =
      "This photograph is currently unavailable.";
  };

  casketGalleryImage.src = item.image;
  [1, -1].forEach((d) => {
    const neighbor = items[(currentCasketIndex + d + items.length) % items.length];
    if (neighbor) new Image().src = neighbor.image;
  });
}

function openCasketGallery(category) {
  activeGallery = serviceGalleries[category];

  if (!activeGallery) return;

  casketGalleryEyebrow.textContent =
    activeGallery.eyebrow;

  const inquiryLink = casketGallery.querySelector(
    ".casket-gallery__inquire"
  );

  inquiryLink.dataset.service = activeGallery.service;

  showCasketItem(0);

  // Reset any previous closing animation.
  clearTimeout(galleryCloseTimer);
  galleryCloseTimer = null;
  casketGallery.classList.remove("is-closing");

  casketGallery.showModal();
}

function closeGallery() {
  if (!casketGallery.open) return;
  if (casketGallery.classList.contains("is-closing")) return;

  casketGallery.classList.add("is-closing");

  galleryCloseTimer = setTimeout(() => {
    casketGallery.close();
    casketGallery.classList.remove("is-closing");
    galleryCloseTimer = null;
  }, 260);
}

casketGallery.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeGallery();
});

// Close button.
closeCasketGallery.addEventListener("click", () => {
  closeGallery();
});

// Close the gallery when clicking the inquiry link.
const casketGalleryInquire = casketGallery.querySelector(
  ".casket-gallery__inquire"
);

casketGalleryInquire.addEventListener("click", () => {
  closeGallery();
});

// All service categories open the shared gallery.
servicePanels.forEach((panel) => {
  const toggle = panel.querySelector(
    ".service-panel__toggle"
  );

  toggle.addEventListener("click", () => {
    const category = toggle.dataset.gallery;

    if (!category || !serviceGalleries[category]) return;

    servicePanels.forEach((otherPanel) => {
      const otherToggle = otherPanel.querySelector(
        ".service-panel__toggle"
      );

      otherToggle.setAttribute("aria-expanded", "false");
    });

    openCasketGallery(category);

    toggle.setAttribute("aria-expanded", "true");
  });
});

// Close button.
casketGallery.addEventListener("close", () => {
  servicePanels.forEach((panel) => {
    const toggle = panel.querySelector(
      ".service-panel__toggle"
    );

    toggle.setAttribute("aria-expanded", "false");
  });
});

// Previous and next navigation.
casketGalleryPrev.addEventListener("click", () => {
  showCasketItem(currentCasketIndex - 1);
});

casketGalleryNext.addEventListener("click", () => {
  showCasketItem(currentCasketIndex + 1);
});

// Close when clicking outside the visible gallery content.
casketGallery.addEventListener("click", (event) => {
  const galleryContent = casketGallery.querySelector(
    ".casket-gallery__content"
  );

  const bounds = galleryContent.getBoundingClientRect();

  const clickedInsideContent =
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom;

  const clickedGalleryControl = event.target.closest(
    ".casket-gallery__close, .casket-gallery__arrow"
  );

  if (!clickedInsideContent && !clickedGalleryControl) {
    closeGallery();
  }
});

// Keyboard navigation.
document.addEventListener("keydown", (event) => {
  if (!casketGallery.open) return;

  if (event.key === "ArrowLeft") {
    showCasketItem(currentCasketIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showCasketItem(currentCasketIndex + 1);
  }
});

/* =====================================
   PRESELECT SERVICE IN INQUIRY FORM
===================================== */

const serviceChoice = document.getElementById("inquiryService");

document.querySelectorAll(
  ".service-panel__cta, .casket-gallery__inquire"
).forEach((link) => {
  link.addEventListener("click", () => {
    if (!serviceChoice) return;

    const selectedService = link.dataset.service;

    const matchingOption = Array.from(serviceChoice.options).find(
      (option) => option.textContent.trim() === selectedService
    );

    if (matchingOption) {
      serviceChoice.value = matchingOption.value;
    }
  });
});

/* =====================================
   FLOATING SERVICES ARROW
===================================== */
{
  const servicesSection = document.querySelector("#services");
  const floatingArrow = document.querySelector(".hero__scroll");

  if (servicesSection && floatingArrow && "IntersectionObserver" in window) {
    const arrowObserver = new IntersectionObserver(([entry]) => {
      // Hide while Services is on screen, and once it has scrolled past
      const pastServices = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      floatingArrow.classList.toggle("is-hidden", entry.isIntersecting || pastServices);
    });
    arrowObserver.observe(servicesSection);
  }
}

/* =====================================
   NAVIGATION SMOOTH SCROLL
===================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    if (
      !targetId ||
      targetId === "#" ||
      !targetId.startsWith("#")
    ) return;

    if (!target) return;

    event.preventDefault();

    const sectionTop =
      target.getBoundingClientRect().top + window.scrollY;

    // Scroll slightly into the section
    const isTopLink = targetId === "#top" || targetId === "#home";

    // Other destinations scroll slightly into the section.
    const offset = isTopLink ? 0 : 50;

    window.scrollTo({
      top: isTopLink ? 0 : Math.max(0, sectionTop + offset),
      behavior: "smooth"
    });

    // Update the URL without triggering another anchor jump
    history.replaceState(null, "", targetId);
  });
});

/* =====================================
   SERENITY INQUIRY FORM - WEB3FORMS
===================================== */

const inquiryForm = document.getElementById("inquiryForm");
const inquiryStatus = document.getElementById("inquiryStatus");

if (inquiryForm && inquiryStatus) {
  const submitButton = inquiryForm.querySelector(
    'button[type="submit"]'
  );

  inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!inquiryForm.reportValidity()) return;

    submitButton.disabled = true;
    inquiryStatus.textContent = "Sending your inquiry...";

    try {
      const formData = new FormData(inquiryForm);

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        }
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || "Submission failed"
        );
      }

      inquiryStatus.textContent =
        "Thank you! Your inquiry has been sent successfully.";

      showInquiryToast(
        "success",
        "Inquiry sent successfully",
        "Thank you for reaching out. Our team will be in touch."
      );
      inquiryForm.reset();

    } catch (error) {
      console.error("Web3Forms error:", error);

      showInquiryToast(
        "error",
        "Unable to send inquiry",
        "Something went wrong. Please try again."
      );

      inquiryStatus.textContent =
        "Sorry, we couldn't send your inquiry. Please try again.";

    } finally {
      submitButton.disabled = false;
    }
  });
}

/* =====================================
   OUR CREDENTIALS DOCUMENT VIEWER
===================================== */
{
  const modal = document.getElementById("credentialsModal");
  const openButton = document.getElementById("openCredentials");
  const closeButton = document.getElementById("closeCredentials");

  const tabs = Array.from(
    document.querySelectorAll(".credentials-modal__tab")
  );

  const documentImage = document.getElementById("credentialsImage");
  const placeholder = document.getElementById(
    "credentialsPlaceholder"
  );

  const counter = document.getElementById("credentialsCounter");
  const previousButton = document.getElementById("credentialsPrev");
  const nextButton = document.getElementById("credentialsNext");
  const originalLink = document.getElementById(
    "credentialsOpenOriginal"
  );

  if (!modal || !openButton || !closeButton || !tabs.length) {
    return;
  }

  let currentIndex = 0;

  function showDocument(index) {
    currentIndex = (index + tabs.length) % tabs.length;

    const selectedTab = tabs[currentIndex];
    const source = selectedTab.dataset.docSrc?.trim() || "";
    const title = selectedTab.dataset.docTitle || "Document";

    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === currentIndex;

      tab.classList.toggle("is-selected", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });

    counter.textContent = `${currentIndex + 1} / ${tabs.length}`;

    // Reset preview before loading another document.
    documentImage.hidden = true;
    documentImage.removeAttribute("src");
    documentImage.alt = title;

    placeholder.hidden = false;
    placeholder.querySelector("p").textContent =
      "Document preview not yet available.";

    originalLink.hidden = true;
    originalLink.removeAttribute("href");

    if (!source) return;

    // Display image-based documents.
    documentImage.onload = () => {
      documentImage.hidden = false;
      placeholder.hidden = true;
    };

    documentImage.onerror = () => {
      documentImage.hidden = true;
      placeholder.hidden = false;
      placeholder.querySelector("p").textContent =
        "Unable to load the document preview.";
    };

    originalLink.href = source;
    originalLink.hidden = false;

    // PDFs open in a new tab instead of being shown as images.
    if (source.toLowerCase().split("?")[0].endsWith(".pdf")) {
      placeholder.querySelector("p").textContent =
        "PDF document — select Open Original to view it.";
      return;
    }

    documentImage.src = source;
  }

  openButton.addEventListener("click", () => {
    showDocument(0);
    modal.showModal();
  });

  closeButton.addEventListener("click", () => {
    modal.close();
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showDocument(index));
  });

  previousButton.addEventListener("click", () => {
    showDocument(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showDocument(currentIndex + 1);
  });

  // Close when clicking the backdrop outside the dialog.
  modal.addEventListener("click", (event) => {
    if (event.target !== modal) return;

    const bounds = modal.getBoundingClientRect();

    const clickedInside =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;

    if (!clickedInside) modal.close();
  });

  // Native dialog already supports Escape to close.
}



/* =====================================
   ANIMATED SECTION DIVIDERS
===================================== */

const dividers = document.querySelectorAll(".section-divider");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!reducedMotion && "IntersectionObserver" in window) {

  const dividerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          dividerObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  dividers.forEach((divider) => {
    divider.classList.add("is-animated");
    dividerObserver.observe(divider);
  });

}

/* =====================================
   INQUIRY TOAST NOTIFICATION
===================================== */

let toastTimer;

function showInquiryToast(type, title, message) {
  const toast = document.getElementById("inquiryToast");

  clearTimeout(toastTimer);

  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastMessage").textContent = message;
  document.getElementById("toastIcon").textContent =
    type === "success" ? "✓" : "!";

  toast.classList.remove("is-success", "is-error");
  toast.classList.add(`is-${type}`, "is-visible");

  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 5000);
}

document.getElementById("toastClose").addEventListener("click", () => {
  clearTimeout(toastTimer);

  document.getElementById("inquiryToast")
    .classList.remove("is-visible");
});
})

/* Load heavy background images only when they're near the screen */
const lazyBgs = document.querySelectorAll(".service-panel, .credentials");
if ("IntersectionObserver" in window) {
  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("img-ready");
        bgObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "400px 0px" });
  lazyBgs.forEach((el) => bgObserver.observe(el));
} else {
  lazyBgs.forEach((el) => el.classList.add("img-ready"));
}