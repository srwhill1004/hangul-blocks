/* Canvas fireworks + confetti, no libraries. window.HangulFx.celebrate() / stop(). */
(function () {
  'use strict';
  let frozen = null, canvas = null, ctx = null, raf = 0, parts = [], t0 = 0, last = 0, W = 0, H = 0, dpr = 1, bursts = [];
  const DURATION = 2800; // ms
  const COLORS = ['#e9552f', '#f2b134', '#5f8f5a', '#3b8bc4', '#c46ab5', '#ffd86b', '#ffffff'];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function confetti(n) {
    for (let i = 0; i < n; i++) {
      const left = i % 2 === 0, up = rnd(0.6, 1.3), sp = rnd(8, 16);
      parts.push({ k: 'c', x: left ? W * 0.05 : W * 0.95, y: H * 0.85,
        vx: Math.cos(up) * sp * (left ? 1 : -1), vy: -Math.sin(up) * sp,
        w: rnd(6, 11), h: rnd(4, 7), rot: rnd(0, 6.28), vr: rnd(-0.3, 0.3),
        color: pick(COLORS), life: rnd(1900, 2800), age: 0, g: 0.22, drag: 0.985 });
    }
  }
  function firework(x, y) {
    const color = pick(COLORS), n = 38;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd(-0.08, 0.08), sp = rnd(2.5, 6.5);
      parts.push({ k: 's', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rnd(1.6, 3), color: i % 5 === 0 ? '#ffffff' : color,
        life: rnd(900, 1500), age: 0, g: 0.06, drag: 0.965 });
    }
  }
  function frame(now) {
    const dt = Math.min(now - last, 40); last = now; step(dt, now - t0);
    if (now - t0 < DURATION + 200 && (parts.length || bursts.length)) raf = requestAnimationFrame(frame);
    else stop();
  }
  function step(dt, el) {
    while (bursts.length && bursts[0].at <= el) { const b = bursts.shift(); firework(b.x * W, b.y * H); }
    const k = dt / 16.67;
    ctx.clearRect(0, 0, W, H);
    parts = parts.filter((p) => (p.age += dt) < p.life);
    for (const p of parts) {
      p.vx *= Math.pow(p.drag, k); p.vy = p.vy * Math.pow(p.drag, k) + p.g * k;
      p.x += p.vx * k; p.y += p.vy * k;
      const alpha = Math.max(0, Math.min(1, (p.life - p.age) / 500));
      ctx.globalAlpha = alpha; ctx.fillStyle = p.color;
      if (p.k === 'c') {
        p.rot += p.vr * k; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.scale(1, Math.abs(Math.sin(p.age / 120 + p.rot)) * 0.8 + 0.2);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      } else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }
  function stop() {
    cancelAnimationFrame(raf); raf = 0; parts = []; bursts = [];
    if (canvas) { canvas.remove(); canvas = null; ctx = null; }
  }
  // opts.still: fast-forward `still` ms then freeze the frame (used for screenshots)
  function celebrate(opts) {
    opts = opts || {}; stop(); frozen = null;
    canvas = document.createElement('canvas'); canvas.className = 'fx-canvas'; canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas); ctx = canvas.getContext('2d'); size();
    confetti(110);
    bursts = [{ at: 0, x: 0.5, y: 0.3 }, { at: 250, x: 0.2, y: 0.22 }, { at: 450, x: 0.8, y: 0.25 }, { at: 800, x: 0.35, y: 0.5 }, { at: 1100, x: 0.7, y: 0.45 }, { at: 1500, x: 0.5, y: 0.2 }];
    if (opts.still) { frozen = opts; let el = 0; while (el < opts.still) { step(16.67, el); el += 16.67; } return; }
    t0 = last = performance.now(); raf = requestAnimationFrame(frame);
  }
  window.addEventListener('resize', () => { if (!canvas) return; if (frozen) celebrate(frozen); else size(); });
  window.HangulFx = { celebrate, stop };
})();
