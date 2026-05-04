/**
 * PlanetMC — assets/js/animations.js
 * Canvas animations: stars, dust particles, Minecraft mob sprites.
 */

/* ════ STARS ════ */
(function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], scrollY_ = 0;

  function resize() {
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
  }

  function initStars() {
    const count = (typeof SETTINGS !== 'undefined') ? SETTINGS.starCount : 260;
    stars = Array.from({ length: count }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      baseY: 0,
      r:     Math.random() * 1.7 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * .004 + .001,
      dir:   Math.random() > .5 ? 1 : -1,
      depth: Math.random() * .4 + .05,
    }));
    stars.forEach(s => s.baseY = s.y);
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sf = scrollY_ * .05;
    stars.forEach(s => {
      s.alpha += s.speed * s.dir;
      if (s.alpha >= 1)    { s.alpha = 1;    s.dir = -1; }
      if (s.alpha <= 0.05) { s.alpha = 0.05; s.dir =  1; }
      const py = (s.baseY - sf * s.depth + canvas.height) % canvas.height;
      ctx.beginPath();
      ctx.arc(s.x, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', () => { resize(); initStars(); }, { passive: true });
  window.addEventListener('scroll', () => { scrollY_ = window.scrollY; }, { passive: true });

  resize();
  initStars();
  drawStars();
})();


/* ════ DUST PARTICLES ════ */
(function initDustCanvas() {
  const dustCv  = document.getElementById('dustCanvas');
  if (!dustCv) return;
  const dustCtx = dustCv.getContext('2d');
  let dustPts   = [];

  function resizeDust() {
    dustCv.width  = innerWidth;
    dustCv.height = innerHeight;
  }

  function initDust() {
    const count = (typeof SETTINGS !== 'undefined') ? SETTINGS.dustCount : 55;
    dustPts = Array.from({ length: count }, () => ({
      x:    Math.random() * dustCv.width,
      y:    Math.random() * dustCv.height,
      vx:   (Math.random() - .5) * .18,
      vy:   (Math.random() - .5) * .18 - .04,
      r:    Math.random() * 1.4 + .3,
      alpha: Math.random() * .35 + .05,
      hue:  Math.random() > .5 ? '180,240,255' : '180,140,255',
    }));
  }

  function drawDust() {
    dustCtx.clearRect(0, 0, dustCv.width, dustCv.height);
    dustPts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0)            p.x = dustCv.width;
      if (p.x > dustCv.width) p.x = 0;
      if (p.y < 0)            p.y = dustCv.height;
      if (p.y > dustCv.height) p.y = 0;
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

  window.addEventListener('resize', () => { resizeDust(); }, { passive: true });

  resizeDust();
  initDust();
  drawDust();
})();


/* ════ MINECRAFT PIXEL SPRITES ════ */
(function drawMobSprites() {
  function drawSprite(id, data, scale) {
    const cv = document.getElementById(id);
    if (!cv) return;
    const cx = cv.getContext('2d');
    cx.imageSmoothingEnabled = false;
    cx.clearRect(0, 0, cv.width, cv.height);
    data.forEach((row, y) =>
      row.forEach((col, x) => {
        if (!col) return;
        cx.fillStyle = col;
        cx.fillRect(x * scale, y * scale, scale, scale);
      })
    );
  }

  const _ = null;

  /* Chick */
  const YB='#FFD700', YD='#D4AF00', OC='#FF7A00', ED='#1A0800', HW='#FFFACC', FS='#FF9500';
  const chickData = [
    [_,_,YB,YB,YB,YB,YB,_,_,_],
    [_,YB,YB,YB,YB,YB,YB,YB,_,_],
    [_,YB,HW,ED,YB,YB,YB,YB,_,_],
    [_,YB,YB,OC,OC,YB,YB,YB,_,_],
    [_,YB,YB,YB,YB,YB,YB,YB,_,_],
    [_,_,YB,YD,YD,YD,YB,_,_,_],
    [_,_,YB,YD,YD,YD,YB,_,_,_],
    [_,_,_,YB,YB,YB,_,_,_,_],
    [_,_,_,FS,_,FS,_,_,_,_],
    [_,_,_,FS,_,FS,_,_,_,_],
  ];

  /* Axolotl */
  const AP='#FF6B9D', AL='#FFC0D8', AG='#CC2266', AE='#180007', AT='#FF3380';
  const axolotlData = [
    [_,AG,_,AG,_,AG,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,AG,AG,AG,AG,AG,AG,_,_,_,_,_,_,_,_,_,_,_],
    [AP,AP,AP,AP,AP,AP,AP,AP,AP,_,_,_,_,_,_,_,_,_],
    [AP,AP,AE,AP,AL,AL,AP,AP,AP,AP,AP,_,_,_,_,_,_,_],
    [AP,AP,AP,AL,AL,AL,AL,AP,AP,AP,AP,AP,_,_,_,_,_,_],
    [AP,AP,AL,AL,AL,AL,AP,AP,AP,AP,AP,AP,AP,_,_,_,_,_],
    [_,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,_,_,_,_],
    [_,_,_,_,AP,AP,AP,AP,AP,AP,AP,AP,AP,AP,AT,_,_,_],
    [_,_,_,_,_,_,AP,AP,AP,AP,AT,AT,_,_,_,_,_,_],
  ];

  /* Turtle */
  const TG='#3CB54E', TD='#1E6B2A', TM='#2B8F3C', TW='#92E8A0', TE='#0D1A0D', TL='#72D480';
  const turtleData = [
    [_,_,_,TD,TD,TD,TD,TD,TD,TD,_,_,_,_],
    [_,_,TD,TG,TM,TD,TM,TD,TM,TG,TD,_,_,_],
    [TG,TG,TG,TM,TD,TM,TD,TM,TD,TM,TG,TG,TG,_],
    [TG,TE,TG,TG,TG,TG,TG,TG,TG,TG,TG,TG,TG,TG],
    [TG,TG,TW,TW,TW,TW,TW,TW,TW,TW,TW,TG,TG,_],
    [_,TG,TW,TW,TW,TW,TW,TW,TW,TW,TG,_,_,_],
    [_,TG,TL,TL,_,TL,TL,_,_,TL,TG,_,_,_],
    [_,_,TG,TG,_,TG,TG,_,_,TG,_,_,_,_],
    [_,_,TG,_,_,TG,_,_,_,_,_,_,_,_],
  ];

  drawSprite('mc-chick',   chickData,   5);
  drawSprite('mc-axolotl', axolotlData, 5);
  drawSprite('mc-turtle',  turtleData,  5);
})();
