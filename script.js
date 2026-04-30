cat > /home/claude/index.html << 'ENDOFFILE'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Hardy — Keyboard Modding & Building</title>
<meta name="description" content="Professional switch lubing, custom keyboard builds, PCB design and repair. Based in Jammu & Kashmir. Pan-India service."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0c0c0b;
    --bg2:      #111110;
    --bg3:      #181816;
    --line:     rgba(255,255,255,0.07);
    --text:     #e8e4db;
    --muted:    rgba(232,228,219,0.38);
    --accent:   #c8a96e;
    --accent2:  #8b6f3a;
    --mono:     'DM Mono', monospace;
    --serif:    'Cormorant Garamond', Georgia, serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--serif);
    font-weight: 300;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* ── CURSOR ── */
  * { cursor: none !important; }
  #cursor {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    position: fixed;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease, opacity 0.2s;
    transform: translate(-50%, -50%);
  }
  #cursor-ring {
    width: 32px; height: 32px;
    border: 1px solid rgba(200,169,110,0.4);
    border-radius: 50%;
    position: fixed;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.45s cubic-bezier(0.23,1,0.32,1), width 0.3s, height 0.3s, opacity 0.2s;
    transform: translate(-50%, -50%);
  }

  /* ── NAV ── */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 28px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    mix-blend-mode: normal;
  }
  nav::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(12,12,11,0.9) 0%, transparent 100%);
    z-index: -1;
    pointer-events: none;
  }
  .nav-logo {
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 0.12em;
    color: var(--text);
    text-decoration: none;
    text-transform: uppercase;
  }
  .nav-links {
    display: flex;
    gap: 40px;
    list-style: none;
  }
  .nav-links a {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--text); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 48px 80px;
    position: relative;
    border-bottom: 1px solid var(--line);
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }
  .hero-bg canvas {
    width: 100%; height: 100%;
    opacity: 0.55;
  }
  .hero-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 60% 40%, transparent 30%, rgba(12,12,11,0.85) 80%);
  }
  .hero-bottom-fade {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 280px;
    background: linear-gradient(to bottom, transparent, var(--bg));
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 900px;
  }

  .hero-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .hero-eyebrow::before {
    content: '';
    width: 32px;
    height: 1px;
    background: var(--accent);
    display: block;
  }

  .hero-title {
    font-size: clamp(3.5rem, 8vw, 7.5rem);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -0.02em;
    margin-bottom: 40px;
  }
  .hero-title em {
    font-style: italic;
    color: var(--accent);
  }

  .hero-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 40px;
  }
  .hero-desc {
    font-size: 1rem;
    color: var(--muted);
    max-width: 360px;
    line-height: 1.7;
  }
  .hero-scroll {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: scrollBob 2.4s ease-in-out infinite;
  }
  .hero-scroll::after {
    content: '';
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, var(--muted), transparent);
    display: block;
  }
  @keyframes scrollBob {
    0%, 100% { transform: translateY(0); opacity: 0.38; }
    50%       { transform: translateY(6px); opacity: 0.7; }
  }

  /* ── SECTION BASE ── */
  section { border-bottom: 1px solid var(--line); }

  .wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
  }

  .sec-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 32px 0 0;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .sec-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  /* ── INTRO ── */
  .intro { padding: 0 48px; }
  .intro-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 0 100px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
    align-items: start;
  }
  .intro-left {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    padding-top: 8px;
  }
  .intro-text {
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 300;
    line-height: 1.5;
    color: var(--text);
  }
  .intro-text em { font-style: italic; color: var(--accent); }

  /* ── SERVICES ── */
  .services-section { padding: 0 48px 0; }
  .services-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 100px;
  }

  .services-header {
    padding: 60px 0 48px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 40px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 0;
  }
  .services-title {
    font-size: clamp(2.2rem, 5vw, 4rem);
    font-weight: 300;
    letter-spacing: -0.02em;
  }
  .services-title em { font-style: italic; color: var(--accent); }
  .services-count {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.1em;
    white-space: nowrap;
  }

  /* service rows */
  .svc-row {
    display: grid;
    grid-template-columns: 48px 1fr auto auto;
    align-items: center;
    gap: 24px;
    padding: 26px 0;
    border-bottom: 1px solid var(--line);
    transition: background 0.3s;
    position: relative;
  }
  .svc-row::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--bg3);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  .svc-row:hover::before { opacity: 1; }

  .svc-num {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.1em;
  }
  .svc-name {
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--text);
    position: relative;
    z-index: 1;
  }
  .svc-detail {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-align: right;
    position: relative;
    z-index: 1;
  }
  .svc-price {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--accent);
    letter-spacing: 0.06em;
    text-align: right;
    min-width: 90px;
    position: relative;
    z-index: 1;
  }

  /* combo highlight */
  .svc-row.featured {
    background: rgba(200,169,110,0.04);
    border-color: rgba(200,169,110,0.2);
  }
  .svc-row.featured .svc-name { color: var(--accent); }

  /* category headers */
  .svc-cat {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 36px 0 12px 72px;
    opacity: 0.6;
  }

  /* ── INFO GRID ── */
  .info-section { padding: 0 48px; }
  .info-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 0 100px;
  }
  .info-title {
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 300;
    margin-bottom: 56px;
    letter-spacing: -0.02em;
  }
  .info-title em { font-style: italic; color: var(--accent); }
  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .info-card {
    background: var(--bg2);
    padding: 36px 32px;
    transition: background 0.3s;
  }
  .info-card:hover { background: var(--bg3); }
  .info-card-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }
  .info-card-val {
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 6px;
  }
  .info-card-sub {
    font-size: 0.85rem;
    color: var(--muted);
  }

  /* ── CTA ── */
  .cta-section {
    padding: 120px 48px 140px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-section::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 600px; height: 600px;
    transform: translate(-50%, -50%);
    background: radial-gradient(ellipse, rgba(200,169,110,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-eyebrow {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 32px;
  }
  .cta-title {
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -0.03em;
    margin-bottom: 48px;
  }
  .cta-title em { font-style: italic; color: var(--accent); }
  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--bg);
    background: var(--accent);
    text-decoration: none;
    padding: 16px 36px;
    transition: background 0.3s, transform 0.3s;
  }
  .cta-btn:hover {
    background: #d4b880;
    transform: translateY(-2px);
  }
  .cta-btn svg { width: 14px; height: 14px; }

  /* ── FOOTER ── */
  footer {
    padding: 40px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-brand {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .footer-tag {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--muted);
    opacity: 0.5;
  }

  /* ── REVEAL ── */
  .rv {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .rv.visible { opacity: 1; transform: translateY(0); }
  .rv-delay-1 { transition-delay: 0.1s; }
  .rv-delay-2 { transition-delay: 0.2s; }
  .rv-delay-3 { transition-delay: 0.3s; }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    nav, .hero, .intro, .services-section, .info-section, .cta-section, footer {
      padding-left: 24px;
      padding-right: 24px;
    }
    .wrap { padding: 0 24px; }
    .intro-inner { grid-template-columns: 1fr; gap: 24px; }
    .info-grid { grid-template-columns: 1fr; }
    .svc-row { grid-template-columns: 36px 1fr auto; }
    .svc-detail { display: none; }
    .hero-footer { flex-direction: column; align-items: flex-start; }
    .nav-links { gap: 24px; }
  }
</style>
</head>
<body>

<div id="cursor"></div>
<div id="cursor-ring"></div>

<!-- NAV -->
<nav>
  <a href="#" class="nav-logo">Hardy</a>
  <ul class="nav-links">
    <li><a href="#services">Services</a></li>
    <li><a href="#info">Info</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg">
    <canvas id="hero-canvas"></canvas>
    <div class="hero-vignette"></div>
    <div class="hero-bottom-fade"></div>
  </div>
  <div class="hero-content">
    <div class="hero-eyebrow">Electronics Engineer &amp; Keyboard Specialist</div>
    <h1 class="hero-title">
      Keyboard<br/>
      Modding &amp;<br/>
      <em>Building.</em>
    </h1>
    <div class="hero-footer">
      <p class="hero-desc">From hobby mods to full custom builds — every switch treated with precision and care.</p>
      <div class="hero-scroll">Scroll</div>
    </div>
  </div>
</section>

<!-- INTRO -->
<section class="intro">
  <div class="intro-inner rv">
    <div class="intro-left">About</div>
    <p class="intro-text">
      I envision a world where every keyboard is built with <em>care and intention</em>, bringing daily joy to the people who use them. Switch lubing, custom builds, PCB design — based in Jammu &amp; Kashmir, serving all of India.
    </p>
  </div>
</section>

<!-- SERVICES -->
<section class="services-section" id="services">
  <div class="services-inner">
    <div class="services-header rv">
      <h2 class="services-title">All <em>Services</em></h2>
      <span class="services-count">24 services available</span>
    </div>

    <div class="svc-cat rv">Switch Services</div>
    <div class="svc-row rv rv-delay-1">
      <span class="svc-num">01</span>
      <span class="svc-name">Krytox 205g0 Lubing</span>
      <span class="svc-detail">Smooth, consistent application</span>
      <span class="svc-price">₹12 / switch</span>
    </div>
    <div class="svc-row rv rv-delay-2">
      <span class="svc-num">02</span>
      <span class="svc-name">Durock Films</span>
      <span class="svc-detail">Premium switch stabilization</span>
      <span class="svc-price">₹7 / switch</span>
    </div>
    <div class="svc-row rv rv-delay-3">
      <span class="svc-num">03</span>
      <span class="svc-name">TX Films</span>
      <span class="svc-detail">Heavy-duty film option</span>
      <span class="svc-price">₹9 / switch</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">04</span>
      <span class="svc-name">Spring Swap &amp; Oil</span>
      <span class="svc-detail">Supply your own springs</span>
      <span class="svc-price">₹3 / switch</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">05</span>
      <span class="svc-name">Switch Stem Tuning</span>
      <span class="svc-detail">Light polishing for feel</span>
      <span class="svc-price">₹5 / switch</span>
    </div>

    <div class="svc-row featured rv">
      <span class="svc-num">★</span>
      <span class="svc-name">Complete Switch Mod — Lube + Film + Spring</span>
      <span class="svc-detail">Best value combo</span>
      <span class="svc-price">₹20 / switch</span>
    </div>

    <div class="svc-cat rv">Stabilizer Tuning</div>
    <div class="svc-row rv">
      <span class="svc-num">06</span>
      <span class="svc-name">Full Stabilizer Service</span>
      <span class="svc-detail">Tune, lube, balance</span>
      <span class="svc-price">₹65 / each</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">07</span>
      <span class="svc-name">Wire Balancing Only</span>
      <span class="svc-detail">Fix rattle &amp; uneven feel</span>
      <span class="svc-price">₹25 / each</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">08</span>
      <span class="svc-name">Restore Old Stabilizers</span>
      <span class="svc-detail">Clean, lube, return ready</span>
      <span class="svc-price">₹40 / each</span>
    </div>

    <div class="svc-cat rv">Build &amp; Soldering</div>
    <div class="svc-row rv">
      <span class="svc-num">09</span>
      <span class="svc-name">Solder Switches</span>
      <span class="svc-detail">Clean 60/40 joints</span>
      <span class="svc-price">₹7 / switch</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">10</span>
      <span class="svc-name">Desolder Switches</span>
      <span class="svc-detail">Gentle removal &amp; cleanup</span>
      <span class="svc-price">₹12 / switch</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">11</span>
      <span class="svc-name">60–65% Keyboard Build</span>
      <span class="svc-detail">Full assembly + solder</span>
      <span class="svc-price">₹500–550</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">12</span>
      <span class="svc-name">TKL Keyboard Build</span>
      <span class="svc-detail">Full assembly + solder</span>
      <span class="svc-price">₹650–800</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">13</span>
      <span class="svc-name">Millmax Socket Install</span>
      <span class="svc-detail">Make solder PCB hotswappable</span>
      <span class="svc-price">₹18 / socket</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">14</span>
      <span class="svc-name">Hotswap Socket Install / Replace</span>
      <span class="svc-detail">Broken or new sockets</span>
      <span class="svc-price">₹13 / socket</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">15</span>
      <span class="svc-name">Split Keyboard Build</span>
      <span class="svc-detail">Full assembly + solder</span>
      <span class="svc-price">Quote</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">16</span>
      <span class="svc-name">PCB Troubleshooting</span>
      <span class="svc-detail">Trace repair, short fixes</span>
      <span class="svc-price">Quote</span>
    </div>

    <div class="svc-cat rv">Custom &amp; PCB Design</div>
    <div class="svc-row rv">
      <span class="svc-num">17</span>
      <span class="svc-name">PCB Design &amp; Layout</span>
      <span class="svc-detail">Custom PCB from scratch</span>
      <span class="svc-price">Quote</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">18</span>
      <span class="svc-name">PCB Fabrication Support</span>
      <span class="svc-detail">Gerber files, sourcing</span>
      <span class="svc-price">Quote</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">19</span>
      <span class="svc-name">Custom Keyboard Build</span>
      <span class="svc-detail">Case + PCB + switches + keycaps</span>
      <span class="svc-price">Quote</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">20</span>
      <span class="svc-name">Firmware Upload &amp; Testing</span>
      <span class="svc-detail">QMK/ZMK flashing</span>
      <span class="svc-price">Quote</span>
    </div>
    <div class="svc-row rv">
      <span class="svc-num">21</span>
      <span class="svc-name">General Electronics Repair</span>
      <span class="svc-detail">Diagnostics, solder, components</span>
      <span class="svc-price">Quote</span>
    </div>
  </div>
</section>

<!-- INFO -->
<section class="info-section" id="info">
  <div class="info-inner">
    <div class="sec-label rv">Good to know</div>
    <h2 class="info-title rv" style="margin-top:32px">The <em>Details</em></h2>
    <div class="info-grid">
      <div class="info-card rv">
        <div class="info-card-label">Turnaround</div>
        <div class="info-card-val">5–7 days</div>
        <div class="info-card-sub">May vary with complexity</div>
      </div>
      <div class="info-card rv rv-delay-1">
        <div class="info-card-label">Payment</div>
        <div class="info-card-val">On completion</div>
        <div class="info-card-sub">Work samples available on request</div>
      </div>
      <div class="info-card rv rv-delay-2">
        <div class="info-card-label">Shipping</div>
        <div class="info-card-val">Buyer covers</div>
        <div class="info-card-sub">Both directions</div>
      </div>
      <div class="info-card rv">
        <div class="info-card-label">Bulk Orders</div>
        <div class="info-card-val">Negotiable</div>
        <div class="info-card-sub">Open to bulk pricing discussions</div>
      </div>
      <div class="info-card rv rv-delay-1">
        <div class="info-card-label">Compatibility</div>
        <div class="info-card-val">Verify first</div>
        <div class="info-card-sub">Check parts before shipping</div>
      </div>
      <div class="info-card rv rv-delay-2">
        <div class="info-card-label">Location</div>
        <div class="info-card-val">Pan-India</div>
        <div class="info-card-sub">Based in Jammu &amp; Kashmir</div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section" id="contact">
  <p class="cta-eyebrow rv">Let's build something great</p>
  <h2 class="cta-title rv">
    Ready to<br/><em>mod?</em>
  </h2>
  <a href="https://discord.com/users/hardy_022" target="_blank" rel="noopener" class="cta-btn rv">
    Contact on Discord
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
</section>

<!-- FOOTER -->
<footer>
  <span class="footer-brand">Hardy — Keyboard Modding &amp; Building</span>
  <span class="footer-tag">Quality work. Fair pricing. Fast turnaround.</span>
</footer>

<script>
// ── CUSTOM CURSOR ──
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cur.style.transform  = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(200,169,110,0.7)'; });
  el.addEventListener('mouseleave', () => { ring.style.width='32px'; ring.style.height='32px'; ring.style.borderColor='rgba(200,169,110,0.4)'; });
});

// ── HERO CANVAS — floating particles ──
(function() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 60;
  const pts = Array.from({length: COUNT}, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00018,
    vy: (Math.random() - 0.5) * 0.00018,
    r: 1 + Math.random() * 1.5,
    a: Math.random(),
  }));

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
    });

    // connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = (pts[i].x - pts[j].x) * w;
        const dy = (pts[i].y - pts[j].y) * h;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x * w, pts[i].y * h);
          ctx.lineTo(pts[j].x * w, pts[j].y * h);
          ctx.strokeStyle = `rgba(200,169,110,${(1 - dist/140) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${p.a * 0.5})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => observer.observe(el));
</script>
</body>
</html>
ENDOFFILE
echo "Done — $(wc -l < /home/claude/index.html) lines"