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
    const elements = document.querySelectorAll('.promise__editorial,.promise__aside,.section-heading,.service-feature,.service-list,.facilities__intro,.facilities__composition,.facilities__bottom,.human-care__inner,.contact__intro,.contact__inquiry');
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

  // Preselect a service when navigating to the inquiry section from a service.
  const serviceChoice = document.getElementById('inquiryService');
  const serviceLinks = {
    'service-feature--chapel': 'Chapel & Viewing',
    'service-feature--flowers': 'Floral Arrangements'
  };
  document.querySelectorAll('.service-feature, .service-list__item').forEach(link => {
    link.addEventListener('click', () => {
      if (!serviceChoice) return;
      let value = '';
      for (const [cls, name] of Object.entries(serviceLinks)) if (link.classList.contains(cls)) value = name;
      if (!value) value = link.querySelector('h3')?.textContent.trim() || '';
      if (Array.from(serviceChoice.options).some(option => option.value === value)) serviceChoice.value = value;
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

    floatingArrow.addEventListener("click", (event) => {
    event.preventDefault();

    const servicesTop =
      servicesSection.getBoundingClientRect().top +
      window.scrollY;

    // Scroll 40px farther into Services
    const extraScroll = 100;

    window.scrollTo({
      top: servicesTop + extraScroll,
      behavior: "smooth"
    });
  });
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

    // Other sections scroll slightly farther into their content
    const offset = isTopLink ? 0 : 50;

    

    window.scrollTo({
      top: Math.max(0, sectionTop + offset),
      behavior: "smooth"
    });

    // Update the URL without triggering another anchor jump
    history.replaceState(null, "", targetId);
  });
});