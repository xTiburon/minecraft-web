import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:8099';
const RUTAS = ['/', '/guias', '/guias/primeros-pasos', '/guias/protecciones', '/guias/comandos', '/guias/pvp'];
const PANTALLAS = [
  { n: 'se-320', w: 320, h: 568, movil: true },
  { n: 'iphone14-390', w: 390, h: 844, movil: true },
  { n: 'pixel-393', w: 393, h: 851, movil: true },
  { n: 'tablet-768', w: 768, h: 1024, movil: true },
  { n: 'desktop-1440', w: 1440, h: 900, movil: false },
];
const DIR = 'caps';
fs.mkdirSync(DIR, { recursive: true });

const browser = await chromium.launch();
let fallos = 0;

for (const p of PANTALLAS) {
  const ctx = await browser.newContext({
    viewport: { width: p.w, height: p.h },
    deviceScaleFactor: 2,
    isMobile: p.movil,
    hasTouch: p.movil,
  });
  for (const ruta of RUTAS) {
    const page = await ctx.newPage();
    const errores = [];
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
    const resp = await page.goto(BASE + ruta, { waitUntil: 'networkidle' });

    const med = await page.evaluate(() => {
      const limite = document.documentElement.clientWidth;
      const culpables = [...document.querySelectorAll('*')].filter((el) => {
        if (el.ownerSVGElement) return false;
        for (let q = el.parentElement; q; q = q.parentElement) {
          const ov = getComputedStyle(q).overflowX;
          if (ov === 'auto' || ov === 'scroll') return false;
        }
        const r = el.getBoundingClientRect();
        return r.right > limite + 1 || r.left < -1;
      }).map((el) => `${el.tagName}.${String(el.className).slice(0, 28)} right=${Math.round(el.getBoundingClientRect().right)}`);
      const pequenos = [...document.querySelectorAll('button, a, input, select, [role="button"]')].filter((el) => {
        const r = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || r.width === 0 || r.height === 0) return false;
        return r.height < 36;
      }).map((el) => `${el.tagName} "${(el.textContent || '').trim().slice(0, 24)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
      const chico = [...document.querySelectorAll('p, li, td, span')].filter((el) => {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        return el.textContent.trim().length > 15 && fs < 13;
      }).length;
      return {
        scroll: document.documentElement.scrollWidth,
        cliente: limite,
        culpables: [...new Set(culpables)].slice(0, 6),
        pequenos: [...new Set(pequenos)].slice(0, 8),
        chico,
      };
    });

    const desborda = med.scroll > med.cliente + 1;
    if (desborda || med.pequenos.length || errores.length || resp.status() !== 200) fallos++;
    console.log(
      `${p.n.padEnd(14)} ${ruta.padEnd(26)} http=${resp.status()} ` +
      `ancho=${med.scroll}/${med.cliente}${desborda ? ' ❌DESBORDA' : ' ok'}` +
      `${med.pequenos.length ? ' táctil<36px:' + med.pequenos.length : ''}` +
      `${med.chico ? ' texto<13px:' + med.chico : ''}` +
      `${errores.length ? ' JS:' + errores.length : ''}`
    );
    if (med.culpables.length) console.log('    se sale:', med.culpables.join(' | '));
    if (med.pequenos.length) console.log('    pequeños:', med.pequenos.join(' | '));
    if (errores.length) console.log('    errores:', errores.slice(0, 3).join(' | '));

    await page.screenshot({ path: `${DIR}/${p.n}${ruta.replace(/\//g, '_') || '_home'}.png`, fullPage: false });
    await page.close();
  }
  await ctx.close();
}

// Interacciones: menú lateral móvil y buscador
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto(BASE + '/guias/protecciones', { waitUntil: 'networkidle' });
const sideOculto = await page.locator('#wkSide').isHidden();
await page.locator('#wkBurger').tap();
const sideVisible = await page.locator('#wkSide').isVisible();
console.log(`\nmenú móvil: oculto al cargar=${sideOculto} · se abre al pulsar=${sideVisible}`);
await page.screenshot({ path: `${DIR}/menu-abierto-390.png` });

await page.locator('#wkSide .wk-search input').fill('proteger');
await page.waitForTimeout(350);
const nres = await page.locator('#wkSide .wk-results a').count();
const prim = nres ? await page.locator('#wkSide .wk-results a b').first().innerText() : '-';
console.log(`buscador móvil: "proteger" -> ${nres} resultados, 1.º = ${prim}`);

const page2 = await ctx.newPage();
await page2.goto(BASE + '/guias', { waitUntil: 'networkidle' });
for (const q of ['/p', 'dinero', 'rtp', 'casa', 'subasta', 'novato', 'koth']) {
  await page2.locator('.wk-search-big input').fill(q);
  await page2.waitForTimeout(250);
  const n = await page2.locator('.wk-results a').count();
  const t = n ? await page2.locator('.wk-results a b').first().innerText() : '—';
  console.log(`  buscar "${q}" -> ${n} resultados, 1.º = ${t}`);
}
await page2.screenshot({ path: `${DIR}/buscador-portada.png` });
await browser.close();
console.log(fallos ? `\n${fallos} pantallas con avisos` : '\nSin avisos en ninguna pantalla');
