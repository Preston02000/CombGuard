/* =========================================================
   CombGuard site engine
   - Nav: solid on scroll, mobile menu
   - Scroll engine: a smoothed ("weighted") scroll position drives
     every animation, so effects trail your scroll slightly and
     always play backwards when you scroll up.
     .rv              -> fades/rises in as it enters (sets --in)
     [data-scene]     -> sets --p from 0 to 1
                         data-scene="sticky": progress through a tall pinned block
                         data-scene="pass":   progress while it crosses the screen
   ========================================================= */
(function () {
  const CG = (window.CG = window.CG || {});
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  CG.reduce = reduce;
  CG.clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  CG.smooth = (a, b, v) => { const t = CG.clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  // ----- Nav -----
  const nav = document.querySelector(".nav");
  const menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  const navState = () => nav && nav.classList.toggle("solid", window.scrollY > 10);
  navState();

  // ----- Scroll engine -----
  const WEIGHT = 0.085;            // lower = heavier, more trailing motion
  const reveals = [...document.querySelectorAll(".rv")];
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const listeners = new Map();      // scene element -> [callback(p)]
  CG.onScene = (el, fn) => { if (!listeners.has(el)) listeners.set(el, []); listeners.get(el).push(fn); };

  let smoothY = window.scrollY, running = false;
  const geo = new Map();

  function measure() {
    reveals.forEach((el) => el.style.setProperty("--in", 1));
    [...reveals, ...scenes].forEach((el) => {
      const r = el.getBoundingClientRect();
      geo.set(el, { top: r.top + window.scrollY, h: r.height });
    });
    frame(true);
  }

  function frame(force) {
    const target = window.scrollY;
    smoothY = reduce ? target : smoothY + (target - smoothY) * WEIGHT;
    if (Math.abs(target - smoothY) < 0.2) smoothY = target;
    const vh = window.innerHeight;

    reveals.forEach((el) => {
      const g = geo.get(el); if (!g) return;
      const top = g.top - smoothY;
      const v = reduce ? 1 : CG.smooth(0, 1, (vh - top) / (vh * 0.32));
      el.style.setProperty("--in", v.toFixed(3));
    });

    scenes.forEach((el) => {
      const g = geo.get(el); if (!g) return;
      const top = g.top - smoothY;
      const p = el.dataset.scene === "sticky"
        ? CG.clamp(-top / Math.max(1, g.h - vh))
        : CG.clamp((vh - top) / (g.h + vh));
      el.style.setProperty("--p", p.toFixed(4));
      (listeners.get(el) || []).forEach((fn) => fn(p));
    });

    if (smoothY !== target || force === true) { running = true; requestAnimationFrame(frame); }
    else running = false;
  }

  window.addEventListener("scroll", () => { navState(); if (!running) { running = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener("resize", () => { measure(); });
  CG.remeasure = measure;
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(measure);
  window.addEventListener("load", measure);
  measure();

  // ----- Modals -----
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-modal]");
    if (opener) {
      const m = document.getElementById(opener.dataset.modal);
      if (m) { m.classList.add("open"); m.querySelector(".modal-close")?.focus(); e.preventDefault(); }
      return;
    }
    const modal = e.target.closest(".modal");
    if (modal && (e.target === modal || e.target.closest(".modal-close"))) modal.classList.remove("open");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".modal.open").forEach((m) => m.classList.remove("open"));
  });
})();
