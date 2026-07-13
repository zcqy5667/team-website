import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initPageAtmosphere() {
  let progress = document.querySelector<HTMLElement>(".ui-scroll-progress");
  if (!progress) {
    progress = document.createElement("div");
    progress.className = "ui-scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.prepend(progress);
  }

  const setProgress = () => {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
    const value = ratio * 100;
    progress?.style.setProperty("--scroll-progress", `${value}%`);
  };

  setProgress();
  window.addEventListener("scroll", setProgress, { passive: true });
  window.addEventListener("resize", setProgress);

  const litCards = gsap.utils.toArray<HTMLElement>(
    ".metric-panel, .mini-stat, .unit-card, .media-card, .media-entry-card, .honor-card, .contact-card, .division-responsibility-card, .unit-detail-card"
  );

  litCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    });
  });
}

function modalTargets(modal: HTMLElement) {
  const backdrop = modal.querySelector<HTMLElement>("[data-modal-backdrop]");
  const panel = modal.querySelector<HTMLElement>(".site-modal-panel");
  const contentItems = Array.from(
    modal.querySelectorAll<HTMLElement>(
      ".site-modal-media, .site-modal-content .eyebrow, .site-modal-content h2, .site-modal-content p, .site-modal-tags, [data-modal-link]"
    )
  ).filter((item) => !item.hidden);

  return { backdrop, panel, contentItems };
}

export function initScrollReveals(selector: string) {
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (targets.length === 0) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { clearProps: "opacity,visibility,transform" });
    return;
  }

  gsap.set(targets, { y: 18 });

  ScrollTrigger.batch(targets, {
    start: "top 86%",
    once: true,
    interval: 0.08,
    batchMax: 6,
    onEnter: (batch) => {
      gsap.to(batch, {
        y: 0,
        duration: 0.62,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: "auto",
        clearProps: "transform",
      });
    },
  });

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

export function animateModalOpen(modal: HTMLElement) {
  const { backdrop, panel, contentItems } = modalTargets(modal);
  if (!backdrop || !panel) return;

  const animatedTargets = [backdrop, panel, ...contentItems];
  gsap.killTweensOf(animatedTargets);

  if (prefersReducedMotion()) {
    gsap.set(animatedTargets, { clearProps: "opacity,visibility,transform" });
    return;
  }

  gsap.set(backdrop, { autoAlpha: 0 });
  gsap.set(panel, { autoAlpha: 0, y: 24, scale: 0.985 });
  gsap.set(contentItems, { autoAlpha: 0, y: 14 });

  gsap
    .timeline({ defaults: { overwrite: "auto" } })
    .to(backdrop, { autoAlpha: 1, duration: 0.2, ease: "power1.out" }, 0)
    .to(panel, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "power3.out" }, 0.04)
    .to(contentItems, { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.035, ease: "power2.out" }, 0.14);
}

export function animateModalClose(modal: HTMLElement, afterClose: () => void) {
  const { backdrop, panel, contentItems } = modalTargets(modal);
  if (!backdrop || !panel || prefersReducedMotion()) {
    afterClose();
    return;
  }

  const animatedTargets = [backdrop, panel, ...contentItems];
  gsap.killTweensOf(animatedTargets);

  gsap
    .timeline({
      defaults: { overwrite: "auto" },
      onComplete: afterClose,
    })
    .to(contentItems, { autoAlpha: 0, y: 8, duration: 0.14, stagger: 0.015, ease: "power1.in" }, 0)
    .to(panel, { autoAlpha: 0, y: 18, scale: 0.985, duration: 0.22, ease: "power2.in" }, 0.02)
    .to(backdrop, { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0.06);
}

export function animateHeroSlide(slides: HTMLElement[], fromIndex: number | null, toIndex: number) {
  const incoming = slides[toIndex];
  const outgoing = fromIndex === null ? null : slides[fromIndex];
  if (!incoming || outgoing === incoming) return;

  const allSlideTargets = slides.flatMap((slide) => [
    slide,
    ...Array.from(slide.querySelectorAll<HTMLElement>(".hero-slide-image, .eyebrow, h1, .hero-copy, .hero-actions")),
  ]);
  gsap.killTweensOf(allSlideTargets);

  if (prefersReducedMotion()) {
    gsap.set(allSlideTargets, { clearProps: "opacity,visibility,transform,zIndex" });
    return;
  }

  const incomingItems = Array.from(incoming.querySelectorAll<HTMLElement>(".eyebrow, h1, .hero-copy, .hero-actions"));
  const incomingImage = incoming.querySelector<HTMLElement>(".hero-slide-image");
  const outgoingItems = outgoing
    ? Array.from(outgoing.querySelectorAll<HTMLElement>(".eyebrow, h1, .hero-copy, .hero-actions"))
    : [];

  gsap.set(incoming, { autoAlpha: 0, zIndex: 2 });
  if (outgoing) gsap.set(outgoing, { autoAlpha: 1, zIndex: 1 });
  gsap.set(incomingItems, { autoAlpha: 0, y: 18 });
  if (incomingImage) gsap.set(incomingImage, { scale: 1.02 });

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => {
      gsap.set(slides, { clearProps: "zIndex" });
      if (outgoing) gsap.set(outgoing, { clearProps: "opacity,visibility" });
      gsap.set(incoming, { clearProps: "opacity,visibility" });
    },
  });

  if (outgoing) {
    timeline
      .to(outgoingItems, { autoAlpha: 0, y: -10, duration: 0.2, stagger: 0.02, ease: "power1.in" }, 0)
      .to(outgoing, { autoAlpha: 0, duration: 0.32, ease: "power1.inOut" }, 0.03);
  }

  timeline
    .to(incoming, { autoAlpha: 1, duration: 0.42, ease: "power2.out" }, outgoing ? 0.1 : 0)
    .to(incomingItems, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.055, ease: "power3.out" }, outgoing ? 0.2 : 0.08);

  if (incomingImage) {
    timeline.to(incomingImage, { scale: 1.1, duration: 5.6, ease: "power1.out" }, outgoing ? 0.08 : 0);
  }
}
