// 统一处理滚动出现、弹窗过渡和首屏轮播的动画辅助函数。
// 这些函数只负责给已有 DOM 节点添加动画，页面渲染仍由 Astro 完成。
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  // 每次调用时读取浏览器偏好，使系统无障碍设置的变化无需重新构建页面即可生效。
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initPageAtmosphere() {
  // 顶部进度条和鼠标指针光效属于页面级增强效果。
  // 找不到对应元素时会直接跳过，不影响页面主要功能。
  let progress = document.querySelector<HTMLElement>(".ui-scroll-progress");
  if (!progress) {
    progress = document.createElement("div");
    progress.className = "ui-scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.prepend(progress);
  }

  const setProgress = () => {
    // 限制进度比例范围，避免短页面没有有效滚动距离时出现异常。
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
    const value = ratio * 100;
    progress?.style.setProperty("--scroll-progress", `${value}%`);
  };

  setProgress();
  window.addEventListener("scroll", setProgress, { passive: true });
  window.addEventListener("resize", setProgress);

  const litCards = gsap.utils.toArray<HTMLElement>(
    ".metric-panel, .unit-card, .media-card, .media-entry-card, .honor-card, .contact-card, .division-responsibility-card, .unit-detail-card"
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
  // 将动画目标集中查询，避免弹窗结构变化后打开和关闭动画的目标不一致。
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
  // 由调用方传入选择器，因为不同页面的内容区块不同，
  // 但滚动出现的动画行为保持统一。
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (targets.length === 0) return;

  if (prefersReducedMotion()) {
    // 清除初始动画样式，让关闭动画偏好的用户立即看到内容。
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
    // 即使关闭所有动画，弹窗也必须保持完整可用。
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
    // 清理工作仍由调用方负责；无法或不应播放动画时直接同步执行回调。
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
  // `fromIndex === null` 表示初始设置，而不是从上一张可见幻灯片切换过来。
  const incoming = slides[toIndex];
  const outgoing = fromIndex === null ? null : slides[fromIndex];
  if (!incoming || outgoing === incoming) return;

  const allSlideTargets = slides.flatMap((slide) => [
    slide,
    ...Array.from(slide.querySelectorAll<HTMLElement>(".hero-slide-image, .eyebrow, h1, .hero-copy, .hero-actions")),
  ]);
  gsap.killTweensOf(allSlideTargets);

  if (prefersReducedMotion()) {
    // 关闭动画时不要残留隐藏、位移或层级样式。
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
