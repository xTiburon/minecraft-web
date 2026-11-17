/* Genera un icono cuadrado con el fondo del sitio ya pintado.
   Los iconos con transparencia los compone iOS sobre BLANCO, así que en la
   pantalla de inicio salían con un marco blanco alrededor del logo.

   node tools/icono-fondo.mjs <origen> <destino> <lado> [margen 0-0.3] [color]

   Necesita Playwright instalado (usa su Chromium para dibujar en un canvas).  */
import { chromium } from 'playwright';
import fs from 'node:fs';

const [, , src, dest, ladoArg, margenArg, colorArg] = process.argv;
if (!src || !dest || !ladoArg) {
  console.error('Uso: node tools/icono-fondo.mjs <origen> <destino> <lado> [margen] [color]');
  process.exit(1);
}
const lado = Number(ladoArg);
const margen = margenArg ? Number(margenArg) : 0.08;
const color = colorArg || '#0A0B0D';

const b = await chromium.launch();
const p = await b.newPage();
const datos = fs.readFileSync(src).toString('base64');
const url = await p.evaluate(async ({ datos, lado, margen, color }) => {
  const img = new Image();
  img.src = 'data:image/png;base64,' + datos;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = lado; c.height = lado;
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, lado, lado);
  const hueco = Math.round(lado * (1 - margen * 2));
  const esc = Math.min(hueco / img.width, hueco / img.height);
  const w = Math.round(img.width * esc);
  const h = Math.round(img.height * esc);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, Math.round((lado - w) / 2), Math.round((lado - h) / 2), w, h);
  return c.toDataURL('image/png');
}, { datos, lado, margen, color });

const png = Buffer.from(url.split(',')[1], 'base64');
fs.writeFileSync(dest, png);

/* Un .ico puede contener un PNG tal cual: cabecera de 6 bytes + entrada de 16. */
if (dest.endsWith('.ico')) {
  const cab = Buffer.alloc(22);
  cab.writeUInt16LE(0, 0); cab.writeUInt16LE(1, 2); cab.writeUInt16LE(1, 4);
  cab.writeUInt8(lado >= 256 ? 0 : lado, 6);
  cab.writeUInt8(lado >= 256 ? 0 : lado, 7);
  cab.writeUInt8(0, 8); cab.writeUInt8(0, 9);
  cab.writeUInt16LE(1, 10); cab.writeUInt16LE(32, 12);
  cab.writeUInt32LE(png.length, 14); cab.writeUInt32LE(22, 18);
  fs.writeFileSync(dest, Buffer.concat([cab, png]));
}

console.log(`${dest}: ${lado}x${lado}, fondo ${color}, ${(fs.statSync(dest).size / 1024).toFixed(0)} KB`);
await b.close();
