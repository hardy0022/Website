/* ══════════════════════════════════════════════════════════
   script.js — Canvas Frame Scrubber + Animations
   KBD.ENG Premium Landing Page
══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────────────────── */
  const TOTAL_FRAMES    = 207;
  const FRAME_DIR       = 'frames/';
  const FRAME_PREFIX    = 'frame_';
  const FRAME_EXT       = '.webp';
  const PRELOAD_BATCH   = 20;   // frames to load concurrently
  const LERP_FACTOR     = 0.10; // smoothing (lower = smoother/slower)

  /* ─────────────────────────────────────────────────────────
     ELEMENT REFS
  ───────────────────────────────────────────────────────── */
  const loader      = document.getElementById('loader');
  const loaderBar   = document.getElementById('loader-bar');
  const loaderText  = document.getElementById('loader-text');
  const nav         = document.getElementById('nav');
  const heroSection = document.getElementById('hero');
  const canvas      = document.getElementById('hero-canvas');
  const ctx         = canvas.getContext('2d');
  const heroContent = document.getElementById('hero-content');
  const scrollInd   = document.getElementById('scroll-ind');
  const frameCur    = document.getElementById('frame-cur');
  const frameHud    = document.getElementById('frame-hud');

  /* ─────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────── */
  const frames       = new Array(TOTAL_FRAMES).fill(null);
  let loadedCount    = 0;
  let currentFrameF  = 0;   // float (lerp source)
  let targetFrameF   = 0;   // float (lerp target)
  let lastDrawnFrame = -1;
  let rafId          = null;
  let heroActive     = true;
  let isReady        = false;

  /* ─────────────────────────────────────────────────────────
     CANVAS SETUP
  ───────────────────────────────────────────────────────── */
  function resizeCanvas () {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw current frame after resize
    const fi = Math.round(currentFrameF);
    if (frames[fi]) drawFrame(fi);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  /* ─────────────────────────────────────────────────────────
     FRAME LOADING
  ───────────────────────────────────────────────────────── */
  /**
   * Pad a number to 4 digits: 1 → "0001"
   */
  function pad4 (n) {
    return String(n).padStart(4, '0');
  }

  function frameSrc (index) {
    return `${FRAME_DIR}${FRAME_PREFIX}${pad4(index + 1)}${FRAME_EXT}`;
  }

  function loadFrame (index) {
    return new Promise((resolve) => {
      if (frames[index]) { resolve(index); return; }
      const img = new Image();
      img.onload = () => {
        frames[index] = img;
        loadedCount++;
        resolve(index);
      };
      img.onerror = () => {
        // On error, mark as failed with a placeholder so we don't retry forever
        frames[index] = 'error';
        loadedCount++;
        resolve(index);
      };
      img.src = frameSrc(index);
    });
  }

  /**
   * Load frames in batches of PRELOAD_BATCH, updating the loader UI.
   * Resolves when ALL frames are attempted.
   */
  async function loadAllFrames () {
    const indices = Array.from({ length: TOTAL_FRAMES }, (_, i) => i);

    for (let i = 0; i < indices.length; i += PRELOAD_BATCH) {
      const batch = indices.slice(i, i + PRELOAD_BATCH);
      await Promise.all(batch.map(loadFrame));

      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      loaderBar.style.width = pct + '%';
      loaderText.textContent = `Loading frames… ${pct}%`;
    }
  }

  /* ─────────────────────────────────────────────────────────
     FRAME DRAWING
  ───────────────────────────────────────────────────────── */
  function drawFrame (index) {
    const img = frames[index];
    if (!img || img === 'error') return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth  || img.width;
    const ih = img.naturalHeight || img.height;

    if (!iw || !ih) return;

    // Cover fit — same as CSS object-fit: cover
    const scale = Math.max(cw / iw, ch / ih);
    const dw    = iw * scale;
    const dh    = ih * scale;
    const dx    = (cw - dw) / 2;
    const dy    = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  /* ─────────────────────────────────────────────────────────
     SCROLL → FRAME MAPPING
  ───────────────────────────────────────────────────────── */
  function getScrollProgress () {
    const rect  = heroSection.getBoundingClientRect();
    const total = heroSection.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / total));
  }

  function lerp (a, b, t) {
    return a + (b - a) * t;
  }

  /* ─────────────────────────────────────────────────────────
     ANIMATION LOOP
  ───────────────────────────────────────────────────────── */
  function tick () {
    if (!heroActive || !isReady) return;

    const progress = getScrollProgress();
    targetFrameF   = progress * (TOTAL_FRAMES - 1);

    // Smooth interpolation
    currentFrameF = lerp(currentFrameF, targetFrameF, LERP_FACTOR);

    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameF)));

    // Only draw if frame changed
    if (frameIndex !== lastDrawnFrame) {
      drawFrame(frameIndex);
      lastDrawnFrame = frameIndex;

      // Update HUD
      if (frameCur) {
        frameCur.textContent = String(frameIndex + 1).padStart(3, '0');
      }
    }

    // Fade hero text out as we scroll
    const textOpacity = Math.max(0, 1 - progress * 2.8);
    heroContent.style.opacity = textOpacity;
    heroContent.style.transform = `translateY(${progress * -30}px)`;

    // Scroll indicator
    if (scrollInd) {
      scrollInd.style.opacity = progress > 0.04 ? '0' : '1';
    }

    rafId = requestAnimationFrame(tick);
  }

  function startLoop () {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }
  function stopLoop () {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* ─────────────────────────────────────────────────────────
     NAV SCROLL STATE
  ───────────────────────────────────────────────────────── */
  function onScroll () {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─────────────────────────────────────────────────────────
     HERO INTERSECTION — start/stop RAF
  ───────────────────────────────────────────────────────── */
  const heroObserver = new IntersectionObserver(
    (entries) => {
      heroActive = entries[0].isIntersecting;
      if (heroActive && isReady) startLoop();
      else stopLoop();
    },
    { threshold: 0 }
  );
  heroObserver.observe(heroSection);

  /* ─────────────────────────────────────────────────────────
     SECTION REVEAL — fade-in on scroll
  ───────────────────────────────────────────────────────── */
  function initRevealSections () {
    const sections = document.querySelectorAll('.rv');
    const secObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            secObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    );
    sections.forEach(el => secObs.observe(el));
  }

  /**
   * Staggered card reveals — each .rv-card gets a delay based on its
   * position within its parent grid.
   */
  function initRevealCards () {
    const grids = document.querySelectorAll('.cards, .info-grid');
    const cardObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const cards = entry.target.querySelectorAll('.rv-card, .info-card');
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, i * 65);
          });
          cardObs.unobserve(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );
    grids.forEach(el => cardObs.observe(el));
  }

  /* ─────────────────────────────────────────────────────────
     INIT — load frames then reveal page
  ───────────────────────────────────────────────────────── */
  async function init () {
    // Lock body scroll during load
    document.body.style.overflow = 'hidden';

    try {
      await loadAllFrames();
    } catch (err) {
      console.warn('Frame loading error:', err);
    }

    // Draw first frame
    if (frames[0] && frames[0] !== 'error') {
      drawFrame(0);
    }

    isReady = true;

    // Show 100% briefly, then hide loader
    loaderBar.style.width = '100%';
    loaderText.textContent = 'Ready';

    await delay(400);

    loader.classList.add('hidden');
    document.body.style.overflow = '';

    // Start animation loop if hero is in view
    if (heroActive) startLoop();

    // Boot reveal observers
    initRevealSections();
    initRevealCards();
  }

  function delay (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ─────────────────────────────────────────────────────────
     HANDLE FONTS READY → then init
  ───────────────────────────────────────────────────────── */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    init();
  }

  /* ─────────────────────────────────────────────────────────
     TOUCH / POINTER: ensure scroll also works on mobile
  ───────────────────────────────────────────────────────── */
  // No extra code needed — RAF reads window.scrollY which works on all platforms.
  // IntersectionObserver handles hero visibility for battery-friendly RAF pause.

  /* ─────────────────────────────────────────────────────────
     RESIZE: redraw on viewport change
  ───────────────────────────────────────────────────────── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      const fi = Math.round(currentFrameF);
      if (frames[fi] && frames[fi] !== 'error') drawFrame(fi);
    }, 100);
  }, { passive: true });

})();
