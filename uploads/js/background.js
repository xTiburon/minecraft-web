/* background.js — Fondo animado: estrellas parallax + polvo cósmico */

let starCanvas, starCtx, stars = [], scrollY_ = 0;
let dustCanvas, dustCtx, dustPts = [];
let reduceMotion = false;

function resizeStarCanvas() {
  starCanvas.width = innerWidth;
  starCanvas.height = innerHeight;
}

function initStars() {
  const count = innerWidth < 640 ? 140 : 240;
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    baseY: 0,
    r: Math.random() * 1.6 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.004 + 0.001,
    dir: Math.random() > 0.5 ? 1 : -1,
    depth: Math.random() * 0.4 + 0.05,
  }));
  stars.forEach((s) => { s.baseY = s.y; });
}

function drawStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  const sf = scrollY_ * 0.05;
  stars.forEach((s) => {
    s.alpha += s.speed * s.dir;
    if (s.alpha >= 1) { s.alpha = 1; s.dir = -1; }
    if (s.alpha <= 0.05) { s.alpha = 0.05; s.dir = 1; }
    const py = (s.baseY - sf * s.depth + starCanvas.height) % starCanvas.height;
    starCtx.beginPath();
    starCtx.arc(s.x, py, s.r, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(210,225,255,${s.alpha})`;
    starCtx.fill();
  });
  if (!reduceMotion) requestAnimationFrame(drawStars);
}

function resizeDust() {
  dustCanvas.width = innerWidth;
  dustCanvas.height = innerHeight;
}

function initDust() {
  const count = innerWidth < 640 ? 26 : 50;
  dustPts = Array.from({ length: count }, () => ({
    x: Math.random() * dustCanvas.width,
    y: Math.random() * dustCanvas.height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18 - 0.04,
    r: Math.random() * 1.4 + 0.3,
    alpha: Math.random() * 0.3 + 0.05,
    hue: Math.random() > 0.5 ? '150,210,255' : '170,140,255',
  }));
}

function drawDust() {
  dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
  dustPts.forEach((p) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = dustCanvas.width; if (p.x > dustCanvas.width) p.x = 0;
    if (p.y < 0) p.y = dustCanvas.height; if (p.y > dustCanvas.height) p.y = 0;
    const g = dustCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
    g.addColorStop(0, `rgba(${p.hue},${p.alpha})`);
    g.addColorStop(1, `rgba(${p.hue},0)`);
    dustCtx.beginPath();
    dustCtx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
    dustCtx.fillStyle = g;
    dustCtx.fill();
  });
  if (!reduceMotion) requestAnimationFrame(drawDust);
}

export function initBackground() {
  starCanvas = document.getElementById('starCanvas');
  dustCanvas = document.getElementById('dustCanvas');
  if (!starCanvas || !dustCanvas) return;

  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  starCtx = starCanvas.getContext('2d');
  dustCtx = dustCanvas.getContext('2d');

  resizeStarCanvas(); initStars(); drawStars();
  resizeDust(); initDust(); drawDust();

  window.addEventListener('resize', () => { resizeStarCanvas(); initStars(); resizeDust(); initDust(); });
  window.addEventListener('scroll', () => { scrollY_ = window.scrollY; }, { passive: true });
}
