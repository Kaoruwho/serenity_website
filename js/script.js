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
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
  const elements = document.querySelectorAll(
    ".promise__editorial, " +
    ".promise__aside, " +
    ".section-heading, " +
    ".service-accordion, " +
    ".contact__intro, " +
    ".contact__inquiry"
  );  
    elements.forEach(el => el.classList.add('reveal'));
    document.body.classList.add('js-motion');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold: 0.07, rootMargin: '0px 0px 30px 0px'});
    elements.forEach(el => revealObserver.observe(el));
  }


/* =====================================
   SERVICES ACCORDION — CLICK TO EXPAND
===================================== */

const servicePanels = document.querySelectorAll(".service-panel");

servicePanels.forEach((panel) => {
  const toggle = panel.querySelector(".service-panel__toggle");

  toggle.addEventListener("click", () => {
    const wasOpen = panel.classList.contains("is-active");

    // Close all panels.
    servicePanels.forEach((otherPanel) => {
      otherPanel.classList.remove("is-active");

      const otherToggle = otherPanel.querySelector(
        ".service-panel__toggle"
      );

      otherToggle.setAttribute("aria-expanded", "false");
    });

    // Open the selected panel only if it was previously closed.
    if (!wasOpen) {
      panel.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
});


/* =====================================
   PRESELECT SERVICE IN INQUIRY FORM
===================================== */

const serviceChoice = document.getElementById("inquiryService");

document.querySelectorAll(".service-panel__cta").forEach((link) => {
  link.addEventListener("click", () => {
    if (!serviceChoice) return;

    const selectedService = link.dataset.service;

    const matchingOption = Array.from(serviceChoice.options).find(
      (option) => option.value === selectedService
    );

    if (matchingOption) {
      serviceChoice.value = selectedService;
    }
  });
});
});

/* =====================================
   FLOATING SERVICES ARROW
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const servicesSection = document.querySelector("#services");
  const floatingArrow = document.querySelector(".hero__scroll");

  if (!servicesSection || !floatingArrow) return;

  const updateArrowVisibility = () => {
  const servicesTop = servicesSection.getBoundingClientRect().top;

  // Hide as soon as the Services section enters the viewport
  const hasReachedServices = servicesTop <= window.innerHeight;

  floatingArrow.classList.toggle("is-hidden", hasReachedServices);
  };

    window.addEventListener("scroll", updateArrowVisibility, {
      passive: true
    });

    window.addEventListener("resize", updateArrowVisibility);

    // Set the correct state when loading the page
    updateArrowVisibility();
});

/* =====================================
   NAVIGATION SMOOTH SCROLL
===================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

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

      inquiryForm.reset();

    } catch (error) {
      console.error("Web3Forms error:", error);

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

document.addEventListener("DOMContentLoaded", () => {
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
});


/* =====================================
   ANIMATED SECTION DIVIDERS
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const dividers = document.querySelectorAll(
    ".section-divider"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

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
});
