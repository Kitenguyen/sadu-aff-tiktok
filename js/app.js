import { UI_CONFIG } from "./config.js";
import { setupCalculator } from "./calculator.js";
import { setupRegistrationForm } from "./form.js";
import {
  setupBackToTop,
  setupRippleEffects,
  setupScrollProgress,
  setupSmoothAnchors,
  setupStickyCta,
} from "./interactions.js";
import { qs, qsa, supportsNativeLazyLoading } from "./utils.js";

// Progressive enhancement:
// keep all content visible by default, and only enable reveal animations
// when the JavaScript bundle has successfully loaded.
document.documentElement.classList.add("js-motion");

function setDocumentTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function setupStickyHeader() {
  const header = qs(".site-header");
  const menuToggle = qs(".menu-toggle");
  const siteNav = qs(".site-nav");
  const navLinks = qsa(".site-nav a");

  if (!header) {
    return;
  }

  // Switch the header surface once the user starts scrolling.
  const syncHeaderState = () => {
    const isScrolled = window.scrollY > 12;
    header.classList.toggle("is-scrolled", isScrolled);
  };

  const closeMenu = () => {
    if (!menuToggle || !siteNav) {
      return;
    }

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    header.classList.remove("is-menu-open");
    siteNav.setAttribute("data-open", "false");
  };

  const toggleMenu = () => {
    if (!menuToggle || !siteNav) {
      return;
    }

    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu"
    );
    header.classList.toggle("is-menu-open", !isOpen);
    siteNav.setAttribute("data-open", String(!isOpen));
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      header.classList.contains("is-menu-open") &&
      !header.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeMenu();
    }
  });
}

function setupScrollReveal() {
  const revealItems = qsa(".reveal-on-scroll, .reveal-section");
  if (!revealItems.length || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  // Reveal timeline cards only when they enter the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function bootFoundation() {
  setDocumentTheme(UI_CONFIG.defaultTheme);
  setupStickyHeader();
  setupScrollReveal();
  setupCalculator();
  setupSmoothAnchors();
  setupStickyCta();
  setupBackToTop();
  setupScrollProgress();
  setupRippleEffects();
  setupRegistrationForm({});

  const shell = qs(".site-shell");
  if (shell) {
    shell.dataset.lazyReady = String(supportsNativeLazyLoading());
  }
}

document.addEventListener("DOMContentLoaded", bootFoundation);
