(function () {
  const site = window.RM_SITE || {};
  const team = site.team || {};
  const units = Array.isArray(site.units) ? site.units : [];
  const media = Array.isArray(site.media) ? site.media : [];
  const slides = Array.isArray(site.heroSlides) ? site.heroSlides : [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function listMarkup(items, className) {
    return `<ul class="${className}">${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function unitCardMarkup(unit, variant = "full") {
    const functions = variant === "preview" ? (unit.functions || []).slice(0, 2) : unit.functions || [];
    return `
      <article class="unit-card" id="${escapeHtml(unit.id)}">
        <a class="unit-card-link" href="units.html#${escapeHtml(unit.id)}" aria-label="查看 ${escapeHtml(unit.name)}">
          <div class="unit-visual">
            <img src="${escapeHtml(unit.image)}" alt="${escapeHtml(unit.name)}示意图" loading="lazy" />
            <span class="unit-number">${escapeHtml(unit.number)}</span>
          </div>
          <div class="unit-body">
            <span class="unit-role">${escapeHtml(unit.role)}</span>
            <h3>${escapeHtml(unit.name)}</h3>
            <p>${escapeHtml(unit.summary)}</p>
            ${listMarkup(functions, "function-list")}
            ${listMarkup(unit.tags, "tag-list")}
          </div>
        </a>
      </article>
    `;
  }

  function mediaMarkup(item) {
    const title = escapeHtml(item.title);
    const caption = escapeHtml(item.caption);

    if (item.type === "video") {
      const frame = item.src
        ? `<video src="${escapeHtml(item.src)}" poster="${escapeHtml(item.poster || "")}" controls preload="metadata"></video>`
        : `<img src="${escapeHtml(item.poster || "assets/images/video-placeholder.svg")}" alt="${title}" loading="lazy" />`;

      return `
        <article class="media-card">
          <div class="media-frame media-frame-video">${frame}<span class="play-chip">PLAY</span></div>
          <div class="media-meta">
            <strong>${title}</strong>
            <span>${caption || "视频素材待添加"}</span>
          </div>
        </article>
      `;
    }

    return `
      <article class="media-card">
        <div class="media-frame">
          <img src="${escapeHtml(item.src)}" alt="${title}" loading="lazy" />
        </div>
        <div class="media-meta">
          <strong>${title}</strong>
          <span>${caption}</span>
        </div>
      </article>
    `;
  }

  function renderStats() {
    const mediaCount = media.length;
    setText('[data-stat="teamCount"]', "1");
    setText('[data-stat="unitCount"]', units.length);
    setText('[data-stat="mediaCount"]', mediaCount);
  }

  function renderTeam() {
    setText("[data-team-name]", team.name || "xxxx 战队");
    setText("[data-team-school]", team.school || "xxxx 大学");
    setText("[data-team-location]", team.location || "xxxx");
    setText("[data-team-slogan]", team.slogan || "xxxx");
    setText("[data-team-summary]", team.summary || "xxxx");
    setText("[data-team-detail]", team.detail || "xxxx");

    const logo = document.querySelector("[data-team-logo]");
    if (logo) logo.textContent = team.logo || "RM";

    const cover = document.querySelector("[data-team-cover]");
    if (cover) {
      cover.src = team.cover || "assets/images/team-placeholder.svg";
      cover.alt = `${team.name || "xxxx 战队"}封面`;
    }

    const tags = document.querySelector("[data-team-tags]");
    if (tags) tags.innerHTML = listMarkup(team.tags || [], "tag-list");

    const statGrid = document.querySelector("[data-team-stats]");
    if (statGrid) {
      statGrid.innerHTML = (team.stats || [])
        .map(
          (stat) => `
            <article class="mini-stat">
              <strong>${escapeHtml(stat.value)}</strong>
              <span>${escapeHtml(stat.label)}</span>
            </article>
          `
        )
        .join("");
    }
  }

  function renderUnits() {
    const previewGrid = document.querySelector("[data-unit-preview]");
    if (previewGrid) {
      previewGrid.innerHTML = units.slice(0, 4).map((unit) => unitCardMarkup(unit, "preview")).join("");
    }

    const unitGrid = document.querySelector("[data-unit-grid]");
    if (unitGrid) {
      unitGrid.innerHTML = units.map((unit) => unitCardMarkup(unit)).join("");
    }
  }

  function renderMedia() {
    const previewGrid = document.querySelector("[data-media-preview]");
    if (previewGrid) {
      previewGrid.innerHTML = media
        .filter((item) => item.featured)
        .slice(0, 3)
        .map(mediaMarkup)
        .join("");
    }

    const mediaGrid = document.querySelector("[data-media-grid]");
    if (mediaGrid) {
      mediaGrid.innerHTML = media.map(mediaMarkup).join("");
    }
  }

  function renderSlides() {
    const slider = document.querySelector("[data-hero-slider]");
    if (!slider || slides.length === 0) return;

    const track = slider.querySelector("[data-slide-track]");
    const dots = slider.querySelector("[data-slide-dots]");
    const progress = slider.querySelector("[data-slide-progress]");
    const previous = slider.querySelector("[data-slide-prev]");
    const next = slider.querySelector("[data-slide-next]");
    let current = 0;
    let timer = null;
    let startX = 0;

    track.innerHTML = slides
      .map(
        (slide, index) => `
          <article class="hero-slide ${index === 0 ? "is-active" : ""}" data-slide="${index}" aria-hidden="${index === 0 ? "false" : "true"}">
            <img class="hero-slide-image" src="${escapeHtml(slide.image)}" alt="" />
            <div class="hero-slide-shade"></div>
            <div class="hero-slide-content">
              <p class="eyebrow">${escapeHtml(slide.kicker)}</p>
              <h1>${escapeHtml(slide.title)}</h1>
              <p class="hero-copy">${escapeHtml(slide.description)}</p>
              <div class="hero-actions">
                <a class="button button-primary" href="${escapeHtml(slide.primaryHref)}">${escapeHtml(slide.primaryLabel)}</a>
                <a class="button button-secondary" href="${escapeHtml(slide.secondaryHref)}">${escapeHtml(slide.secondaryLabel)}</a>
              </div>
            </div>
            <div class="hero-hud" aria-hidden="true">
              ${(slide.meta || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
            </div>
          </article>
        `
      )
      .join("");

    dots.innerHTML = slides
      .map(
        (_slide, index) =>
          `<button class="slide-dot ${index === 0 ? "is-active" : ""}" type="button" data-slide-dot="${index}" aria-label="切换到第 ${index + 1} 张轮播"></button>`
      )
      .join("");

    function activate(index) {
      current = (index + slides.length) % slides.length;
      track.querySelectorAll("[data-slide]").forEach((slide, slideIndex) => {
        const isActive = slideIndex === current;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
      dots.querySelectorAll("[data-slide-dot]").forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === current);
      });
      if (progress) progress.style.setProperty("--progress-index", current + 1);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      if (reduceMotion || timer || slides.length < 2) return;
      timer = window.setInterval(() => activate(current + 1), 5600);
    }

    previous.addEventListener("click", () => activate(current - 1));
    next.addEventListener("click", () => activate(current + 1));
    dots.addEventListener("click", (event) => {
      const dot = event.target.closest("[data-slide-dot]");
      if (dot) activate(Number(dot.dataset.slideDot));
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);
    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") activate(current - 1);
      if (event.key === "ArrowRight") activate(current + 1);
    });
    slider.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
    });
    slider.addEventListener("touchend", (event) => {
      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 48) activate(delta > 0 ? current - 1 : current + 1);
    });

    activate(0);
    start();
  }

  function markCurrentNav() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const target = link.getAttribute("href").split("#")[0] || "index.html";
      link.classList.toggle("is-current", target === page);
    });
  }

  renderStats();
  renderTeam();
  renderUnits();
  renderMedia();
  renderSlides();
  markCurrentNav();
})();
