// ===== Theme toggle =====
(function () {
  const t = document.querySelector('[data-theme-toggle]'),
    r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  t &&
    t.addEventListener('click', () => {
      d = d === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', d);
      t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
      t.innerHTML =
        d === 'dark'
          ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
})();

// ===== Sticky header scroll behavior =====
(function () {
  const header = document.getElementById('siteHeader');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('site-header--scrolled', y > 8);
    if (y > lastY && y > 120) header.classList.add('site-header--hidden');
    else header.classList.remove('site-header--hidden');
    lastY = y;
  }, { passive: true });
})();

// ===== Scroll reveal =====
(function () {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach((el) => io.observe(el));
})();

// ===== Flag activation =====
(function () {
  const btn = document.getElementById('raiseFlagBtn');
  const stage = document.getElementById('flagStage');
  const pill = document.getElementById('statusPill');
  let raised = false;

  function setRaised(state) {
    raised = state;
    stage.setAttribute('data-raised', String(raised));
    pill.setAttribute('data-active', String(raised));
    pill.textContent = raised ? 'Flag activated — ecosystem live' : 'Standing by';
    btn.textContent = raised ? 'Lower the flag' : 'Raise the flag';
  }

  btn.addEventListener('click', () => setRaised(!raised));

  // Auto-raise once the section scrolls into view, if not already toggled by user
  let userToggled = false;
  btn.addEventListener('click', () => { userToggled = true; });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !userToggled) {
        setTimeout(() => setRaised(true), 350);
        io.disconnect();
      }
    });
  }, { threshold: 0.5 });
  io.observe(stage);
})();

// ===== Global data merge canvas =====
(function () {
  const canvas = document.getElementById('mergeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#3eb3ac', '#e2657c', '#eab63e', '#7fd3cb'];
  const NODES = 14;
  let nodes = [];

  function buildNodes() {
    nodes = [];
    const cx = w / 2, cy = h / 2;
    for (let i = 0; i < NODES; i++) {
      const angle = (i / NODES) * Math.PI * 2 + Math.random() * 0.2;
      const radius = Math.min(w, h) * (0.32 + Math.random() * 0.12);
      nodes.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        angle,
        radius,
        speed: 0.0015 + Math.random() * 0.0015,
        r: 3 + Math.random() * 3,
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  buildNodes();

  let raf;
  let visible = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { visible = e.isIntersecting; if (visible && !raf) loop(); });
  });
  io.observe(canvas);

  function loop() {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const t = performance.now() * 0.001;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;

    // pulsing hub
    const hubR = 10 + Math.sin(t * 1.6) * 3;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hubR * 4);
    grad.addColorStop(0, 'rgba(234,182,62,0.55)');
    grad.addColorStop(1, 'rgba(234,182,62,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, hubR * 4, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#eab63e';
    ctx.beginPath(); ctx.arc(cx, cy, hubR, 0, Math.PI * 2); ctx.fill();

    nodes.forEach((n) => {
      n.angle += n.speed;
      const pulse = (Math.sin(t * 1.2 + n.phase) + 1) / 2; // 0..1
      const radius = n.radius * (0.75 + pulse * 0.25);
      n.x = cx + Math.cos(n.angle) * radius;
      n.y = cy + Math.sin(n.angle) * radius;

      // line to hub, opacity pulses with merge cycle
      const lineAlpha = 0.08 + pulse * 0.22;
      ctx.strokeStyle = n.color;
      ctx.globalAlpha = lineAlpha;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // traveling packet toward hub
      const travel = (t * 0.4 + n.phase) % 1;
      const px = n.x + (cx - n.x) * travel;
      const py = n.y + (cy - n.y) * travel;
      ctx.fillStyle = n.color;
      ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(px, py, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;

      // node
      ctx.fillStyle = n.color;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    });
  }
})();

// ===== Verified palette — click a colour, the plate glows (mark stays as-is) =====
(function () {
  const swatches = document.querySelectorAll('.vp-swatch');
  const mark = document.querySelector('.verify-mark');
  const label = document.getElementById('foxAccentLabel');
  if (!swatches.length || !mark) return;
  swatches.forEach((btn) => {
    btn.addEventListener('click', () => {
      swatches.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const hex = btn.getAttribute('data-hex');
      const name = btn.getAttribute('data-name');
      mark.style.setProperty('--vp-active-color', hex);
      mark.classList.add('has-accent');
      if (label) label.textContent = `${name} · ${hex}`;
    });
  });
})();

// ===== Fox mark theme reversal (verified asset, never recoloured) =====
(function () {
  const ICON_INK = '../../brand/assets/samfox-icon-verified-ink.png';
  const ICON_CREAM = '../../brand/assets/samfox-icon-verified-cream.png';
  function applyFoxTheme() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const url = dark ? ICON_CREAM : ICON_INK;
    document.querySelectorAll('[data-foxmark]').forEach((img) => {
      img.src = url;
    });
  }
  applyFoxTheme();
  new MutationObserver(applyFoxTheme).observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-theme']
  });
})();

// ===== Signup form (static demo) =====
(function () {
  const form = document.getElementById('signupForm');
  const note = document.getElementById('formNote');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = "You're on the list. We'll signal the moment the flag goes up.";
  });
})();
