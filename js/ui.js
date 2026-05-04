/* ════════════════════════════════════════════════
   ui.js — Interacciones de UI, Canvas, Sprites
   PlanetMC
   ════════════════════════════════════════════════ */

/* ════ STARS ════ */
const starCanvas = document.getElementById('starCanvas');
const starCtx    = starCanvas.getContext('2d');
let stars = [], scrollY_ = 0;

function resizeStarCanvas() { starCanvas.width = innerWidth; starCanvas.height = innerHeight; }

function initStars() {
  stars = Array.from({ length: 260 }, () => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    baseY: 0,
    r:     Math.random() * 1.7 + 0.2,
    alpha: Math.random(),
    speed: Math.random() * .004 + .001,
    dir:   Math.random() > .5 ? 1 : -1,
    depth: Math.random() * .4 + .05
  }));
  stars.forEach(s => s.baseY = s.y);
}

function drawStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  const sf = scrollY_ * .05;
  stars.forEach(s => {
    s.alpha += s.speed * s.dir;
    if (s.alpha >= 1)    { s.alpha = 1;    s.dir = -1; }
    if (s.alpha <= 0.05) { s.alpha = 0.05; s.dir = 1;  }
    const py = (s.baseY - sf * s.depth + starCanvas.height) % starCanvas.height;
    starCtx.beginPath();
    starCtx.arc(s.x, py, s.r, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(200,220,255,${s.alpha})`;
    starCtx.fill();
  });
  requestAnimationFrame(drawStars);
}

/* ════ DUST PARTICLES ════ */
const dustCanvas = document.getElementById('dustCanvas');
const dustCtx    = dustCanvas.getContext('2d');
let dustPts = [];

function resizeDust() { dustCanvas.width = innerWidth; dustCanvas.height = innerHeight; }

function initDust() {
  dustPts = Array.from({ length: 55 }, () => ({
    x:    Math.random() * dustCanvas.width,
    y:    Math.random() * dustCanvas.height,
    vx:   (Math.random() - .5) * .18,
    vy:   (Math.random() - .5) * .18 - .04,
    r:    Math.random() * 1.4 + .3,
    alpha: Math.random() * .35 + .05,
    hue:  Math.random() > .5 ? '180,240,255' : '180,140,255'
  }));
}

function drawDust() {
  dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
  dustPts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = dustCanvas.width;  if (p.x > dustCanvas.width)  p.x = 0;
    if (p.y < 0) p.y = dustCanvas.height; if (p.y > dustCanvas.height) p.y = 0;
    const g = dustCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
    g.addColorStop(0, `rgba(${p.hue},${p.alpha})`);
    g.addColorStop(1, `rgba(${p.hue},0)`);
    dustCtx.beginPath();
    dustCtx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
    dustCtx.fillStyle = g;
    dustCtx.fill();
  });
  requestAnimationFrame(drawDust);
}

/* ════ MINECRAFT PIXEL SPRITES ════ */
function drawSprite(id, data, scale) {
  const cv = document.getElementById(id); if (!cv) return;
  const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
  cx.clearRect(0, 0, cv.width, cv.height);
  data.forEach((row, y) => row.forEach((col, x) => {
    if (!col) return;
    cx.fillStyle = col;
    cx.fillRect(x * scale, y * scale, scale, scale);
  }));
}

function initSprites() {
  const _ = null;
  const YB='#FFD700', YD='#D4AF00', OC='#FF7A00', ED='#1A0800', HW='#FFFACC', FS='#FF9500';
  const chickData = [
    [_,_,YB,YB,YB,YB,YB,_,_,_], [_,YB,YB,YB,YB,YB,YB,YB,_,_],
    [_,YB,HW,ED,YB,YB,YB,YB,_,_], [_,YB,YB,OC,OC,YB,YB,YB,_,_],
    [_,YB,YB,YB,YB,YB,YB,YB,_,_], [_,_,YB,YD,YD,YD,YB,_,_,_],
    [_,_,YB,YD,YD,YD,YB,_,_,_], [_,_,_,YB,YB,YB,_,_,_,_],
    [_,_,_,FS,_,FS,_,_,_,_], [_,_,_,FS,_,FS,_,_,_,_]
  ];

  const AP='#FF6B9D', AL='#FFC0D8', AG='#CC2266', AE='#180007', AT='#FF3380';
  const axolotlData = [
    [_,AG,_,AG,_,AG,_,_,_,_,_,_,_,_,_,_,_,_], [_,AG,AG,AG,AG,AG,AG,_,_,_,_,_,_,_,_,_,_,_],
    [AP,AP,AP,AP,AP,AP,AP,AP,AP,_,_,_,_,_,_,_,_,_], [AP,AP,AE,AP,AL,AL,AP,AP,AP,AP,AP,_,_,_,_,_,_,_],
    [AP,AP,AP,AL,AL,AL,AL,AP,AP,AP,AP,AP,_,_,_,_,_,_], [AP,AP,AL,AL,AL,AL,AP,AP,AP,AP,AP,AP,AP,_,_,_,_,_],
    [_,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,_,_,_,_], [_,_,_,_,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,AT,_,_,_],
    [_,_,_,_,_,_,AP,AP,AP,AP,AT,AT,_,_,_,_,_,_]
  ];

  const TG='#3CB54E', TD='#1E6B2A', TM='#2B8F3C', TW='#92E8A0', TE='#0D1A0D', TL='#72D480';
  const turtleData = [
    [_,_,_,TD,TD,TD,TD,TD,TD,TD,_,_,_,_], [_,_,TD,TG,TM,TD,TM,TD,TM,TG,TD,_,_,_],
    [TG,TG,TG,TM,TD,TM,TD,TM,TD,TM,TG,TG,TG,_], [TG,TE,TG,TG,TG,TG,TG,TG,TG,TG,TG,TG,TG,TG],
    [TG,TG,TW,TW,TW,TW,TW,TW,TW,TW,TW,TG,TG,_], [_,TG,TW,TW,TW,TW,TW,TW,TW,TW,TG,_,_,_],
    [_,TG,TL,TL,_,TL,TL,_,_,TL,TG,_,_,_], [_,_,TG,TG,_,TG,TG,_,_,TG,_,_,_,_],
    [_,_,TG,_,_,TG,_,_,_,_,_,_,_,_]
  ];

  drawSprite('mc-chick',   chickData,   5);
  drawSprite('mc-axolotl', axolotlData, 5);
  drawSprite('mc-turtle',  turtleData,  5);
}

/* ════ REVEAL ON SCROLL ════ */
function initReveal() {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: .10 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

/* ════ MOBILE NAV ════ */
function initMobileNav() {
  const navToggle     = document.getElementById('navToggle');
  const navMobileMenu = document.getElementById('navMobileMenu');

  navToggle.addEventListener('click', () => {
    const open = navMobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.innerHTML = open
      ? '<i class="fas fa-times" aria-hidden="true"></i>'
      : '<i class="fas fa-bars" aria-hidden="true"></i>';
  });

  navMobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
  }));
}

/* ════ COPY IP ════ */
function copyText(text, message) {
  const showToast = () => {
    const t = document.getElementById('ipToast');
    t.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>${message}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showToast).catch(() => { fallbackCopy(text); showToast(); });
  } else {
    fallbackCopy(text); showToast();
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}

/* ════ EDITION CARD KEYBOARD ACCESSIBILITY ════ */
function initEditionCards() {
  document.querySelectorAll('.edition-card').forEach(b => {
    b.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
    });
  });
}

/* ════ WINDOW RESIZE ════ */
window.addEventListener('resize', () => {
  resizeStarCanvas(); initStars();
  resizeDust();
});

/* ════ SCROLL ════ */
window.addEventListener('scroll', () => { scrollY_ = window.scrollY; }, { passive: true });

/* ════ INIT ALL UI ════ */
function initUI() {
  resizeStarCanvas(); initStars(); drawStars();
  resizeDust();       initDust();  drawDust();
  initSprites();
  initReveal();
  initMobileNav();
  initEditionCards();
}