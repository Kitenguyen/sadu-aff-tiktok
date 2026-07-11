function getHeaderOffset() {
  const header = document.querySelector(".site-header");
  return header ? header.offsetHeight + 12 : 12;
}

export function setupScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) {
    return;
  }

  const syncProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  };

  syncProgress();
  window.addEventListener("scroll", syncProgress, { passive: true });
  window.addEventListener("resize", syncProgress);
}

// Apply a shared offset so anchors stop below the fixed header.
function smoothScrollTo(targetId) {
  const target = document.querySelector(targetId);
  if (!target) {
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({
    top,
    behavior: "smooth",
  });
}

function createRipple(event) {
  const button = event.currentTarget;
  if (!(button instanceof HTMLElement)) {
    return;
  }

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  button.appendChild(ripple);

  window.setTimeout(() => ripple.remove(), 550);
}

export function setupSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      event.preventDefault();
      smoothScrollTo(href);
    });
  });
}

export function setupStickyCta() {
  const stickyCta = document.getElementById("sticky-cta");
  if (!stickyCta) {
    return;
  }

  stickyCta.addEventListener("click", () => smoothScrollTo("#apply-now"));
}

export function setupBackToTop() {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) {
    return;
  }

  const syncVisibility = () => {
    const isVisible = window.scrollY > 720;
    backToTop.hidden = !isVisible;
    backToTop.classList.toggle("is-visible", isVisible);
  };

  syncVisibility();
  window.addEventListener("scroll", syncVisibility, { passive: true });
  backToTop.addEventListener("click", () => smoothScrollTo("#main-content"));
}

// Apply ripple feedback only to high-intent interactive controls.
export function setupRippleEffects() {
  document.querySelectorAll(".btn, .sticky-cta-mobile, .back-to-top").forEach((button) => {
    button.addEventListener("pointerdown", createRipple);
  });
}
