/* ══════════════════════════════════════════════════════════
   script.js — Canvas Frame Scrubber + Animations
   KBD.ENG Premium Landing Page
══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────────────────── */
  const TOTAL_FRAMES          = 207;
  const FRAME_DIR             = 'frames/';
  const FRAME_PREFIX          = 'frame_';
  const FRAME_EXT             = '.webp';
  const PRELOAD_BATCH         = 20;
  const LERP_FACTOR           = 0.055;
  const ANIMATION_DURATION_MS = 3200; // autoplay duration after first scroll

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

  /* ─────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────── */
  const frames       = new Array(TOTAL_FRAMES).fill(null);
  let loadedCount    = 0;
  let currentFrameF  = 0;
  let lastDrawnFrame = -1;
  let rafId          = null;
  let heroActive     = true;
  let isReady        = false;
  let animPlaying    = false;
  let animDone       = false;
  let animStartTime  = null;

  /* ─────────────────────────────────────────────────────────
     CANVAS SETUP
  ───────────────────────────────────────────────────────── */
  function resizeCanvas () {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const fi = Math.round(currentFrameF);
    if (frames[fi] && frames[fi] !== 'error') drawFrame(fi);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  /* ─────────────────────────────────────────────────────────
     FRAME LOADING
  ───────────────────────────────────────────────────────── */
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
      img.onload  = () => { frames[index] = img;      loadedCount++; resolve(index); };
      img.onerror = () => { frames[index] = 'error';  loadedCount++; resolve(index); };
      img.src = frameSrc(index);
    });
  }

  async function loadAllFrames () {
    const indices = Array.from({ length: TOTAL_FRAMES }, (_, i) => i);
    for (let i = 0; i < indices.length; i += PRELOAD_BATCH) {
      const batch = indices.slice(i, i + PRELOAD_BATCH);
      await Promise.all(batch.map(loadFrame));
      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      loaderBar.style.width    = pct + '%';
      loaderText.textContent   = `Loading frames… ${pct}%`;
    }
  }

  /* ─────────────────────────────────────────────────────────
     FRAME DRAWING
  ───────────────────────────────────────────────────────── */
  function drawFrame (index) {
    const img = frames[index];
    if (!img || img === 'error') return;

    const cw = canvas.width,  ch = canvas.height;
    const iw = img.naturalWidth  || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale, dh = ih * scale;
    const dx = (cw - dw) / 2, dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  /* ─────────────────────────────────────────────────────────
     EASING
  ───────────────────────────────────────────────────────── */
  function easeInOut (t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function lerpEased (a, b, t) {
    const et = 1 - Math.pow(1 - t, 2);
    return a + (b - a) * et;
  }

  /* ─────────────────────────────────────────────────────────
     AUTOPLAY LOOP — plays frames automatically after first scroll
  ───────────────────────────────────────────────────────── */
  function playAnimation (timestamp) {
    if (!animStartTime) animStartTime = timestamp;

    const elapsed  = timestamp - animStartTime;
    const rawT     = Math.min(1, elapsed / ANIMATION_DURATION_MS);
    const easedT   = easeInOut(rawT);
    const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(easedT * (TOTAL_FRAMES - 1)));

    currentFrameF = frameIdx;

    if (frameIdx !== lastDrawnFrame) {
      drawFrame(frameIdx);
      lastDrawnFrame = frameIdx;
      if (frameCur) frameCur.textContent = String(frameIdx + 1).padStart(3, '0');
    }

    // Fade hero text out as animation progresses
    heroContent.style.opacity  = Math.max(0, 1 - rawT * 2.5);
    heroContent.style.transform = `translateY(${rawT * -30}px)`;
    if (scrollInd) scrollInd.style.opacity = rawT > 0.04 ? '0' : '1';

    if (rawT < 1) {
      rafId = requestAnimationFrame(playAnimation);
    } else {
      // Finished — unlock scroll and glide to services
      animPlaying = false;
      animDone    = true;
      rafId       = null;
      unlockScroll();
      const main = document.getElementById('main');
      if (main) main.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* ─────────────────────────────────────────────────────────
     TRIGGER
  ───────────────────────────────────────────────────────── */
  function triggerAnimation () {
    if (animPlaying || animDone || !isReady) return;
    animPlaying   = true;
    animStartTime = null;
    if (rafId) cancelAnimationFrame(rafId);
    lockScroll();
    rafId = requestAnimationFrame(playAnimation);
  }

  /* ─────────────────────────────────────────────────────────
     SCROLL LOCK
  ───────────────────────────────────────────────────────── */
  let savedScrollY = 0;

  function lockScroll () {
    savedScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${savedScrollY}px`;
    document.body.style.width    = '100%';
  }

  function unlockScroll () {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, savedScrollY);
  }

  /* ─────────────────────────────────────────────────────────
     INPUT LISTENERS — first scroll/swipe/key triggers autoplay
  ───────────────────────────────────────────────────────── */
  function onWheel (e) {
    if (animDone || animPlaying || !isReady) return;
    if (window.scrollY > 10) return;
    if (e.deltaY > 0) { // scrolling down
      e.preventDefault();
      triggerAnimation();
    }
  }

  let touchStartY = 0;
  function onTouchStart (e) { touchStartY = e.touches[0].clientY; }
  function onTouchMove (e) {
    if (animDone || animPlaying || !isReady) return;
    if (window.scrollY > 10) return;
    if (touchStartY - e.touches[0].clientY > 15) {
      e.preventDefault();
      triggerAnimation();
    }
  }

  function onKeyDown (e) {
    if (animDone || animPlaying || !isReady) return;
    if (window.scrollY > 10) return;
    if (['ArrowDown', 'Space', 'PageDown'].includes(e.code)) {
      e.preventDefault();
      triggerAnimation();
    }
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
     HERO INTERSECTION
  ───────────────────────────────────────────────────────── */
  const heroObserver = new IntersectionObserver(
    (entries) => { heroActive = entries[0].isIntersecting; },
    { threshold: 0 }
  );
  heroObserver.observe(heroSection);

  /* ─────────────────────────────────────────────────────────
     SECTION REVEAL
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

  function initRevealCards () {
    const grids = document.querySelectorAll('.cards, .info-grid');
    const cardObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const cards = entry.target.querySelectorAll('.rv-card, .info-card');
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 65);
          });
          cardObs.unobserve(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );
    grids.forEach(el => cardObs.observe(el));
  }

  /* ─────────────────────────────────────────────────────────
     INIT — loads all frames (with loader progress bar), then waits
  ───────────────────────────────────────────────────────── */
  async function init () {
    document.body.style.overflow = 'hidden';

    try {
      await loadAllFrames();  // <- this is what fills the loading bar
    } catch (err) {
      console.warn('Frame loading error:', err);
    }

    if (frames[0] && frames[0] !== 'error') drawFrame(0);

    isReady = true;

    loaderBar.style.width    = '100%';
    loaderText.textContent   = 'Ready';

    await delay(400);

    loader.classList.add('hidden');
    document.body.style.overflow = '';

    // Now attach input listeners — animation only starts on user interaction
    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('keydown',    onKeyDown);

    initRevealSections();
    initRevealCards();
  }

  function delay (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ─────────────────────────────────────────────────────────
     RESIZE
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

  /* ─────────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────────── */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    init();
  }

})();
