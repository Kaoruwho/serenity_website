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

const servicePanels = Array.from(
  document.querySelectorAll(".service-panel")
);

const canHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
);

let suppressedPanel = null;

function setActivePanel(activePanel) {
  servicePanels.forEach((panel) => {
    const isActive = panel === activePanel;
    const toggle = panel.querySelector(".service-panel__toggle");

    panel.classList.toggle("is-active", isActive);
    toggle.setAttribute("aria-expanded", String(isActive));
  });
}

servicePanels.forEach((panel) => {
  const toggle = panel.querySelector(".service-panel__toggle");

  // Expand on hover for mouse/trackpad users.
  panel.addEventListener("pointerenter", (event) => {
    if (!canHover.matches || event.pointerType !== "mouse") return;

    if (suppressedPanel === panel) return;

    setActivePanel(panel);
  });

  // Collapse when the pointer leaves the panel.
  panel.addEventListener("pointerleave", (event) => {
    if (!canHover.matches || event.pointerType !== "mouse") return;

    if (suppressedPanel === panel) {
      suppressedPanel = null;
    }

    if (panel.classList.contains("is-active")) {
      setActivePanel(null);
    }
  });

  // Click to toggle. Closing suppresses re-opening
  // until the mouse leaves the panel.
  toggle.addEventListener("click", () => {
    const isActive = panel.classList.contains("is-active");

    if (isActive) {
      suppressedPanel = panel;
      setActivePanel(null);
    } else {
      suppressedPanel = null;
      setActivePanel(panel);
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