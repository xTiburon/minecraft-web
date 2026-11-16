# planetmc.net

Sitio estático de PlanetMC: página principal + **guías del Survival** (la wiki oficial), sin build ni dependencias para publicar.

## Estructura

```
index.html                 página principal (HTML + JS al final)
assets/home.css            estilos de la portada
sw.js                      service worker: guías sin conexión
assets/pwa.js              registro del service worker y botón «Instalar»
sin-conexion.html          página que se muestra sin conexión
data/players.json          historial de jugadores (GENERADO cada 2 h)
tools/muestra-jugadores.py toma una muestra y la añade a data/players.json
.github/workflows/historial-jugadores.yml  tarea que lo ejecuta cada 2 h
guias.html                 portada de las guías        -> planetmc.net/guias
guias/<tema>.html          cada guía                   -> planetmc.net/guias/<tema>
assets/wiki.css            estilos de las guías
assets/wiki.js             menú lateral móvil + buscador
assets/wiki-index.js       índice del buscador (GENERADO, no editar)
tools/build-guias.py       generador de las páginas de guías
tools/content/*.html       EL CONTENIDO EDITABLE de cada guía
tools/serve-local.py       servidor de pruebas que imita el cleanUrls de Vercel
tools/audit-movil.mjs      auditor de móvil/escritorio con Playwright (opcional)
assets/                    logo.webp, java.webp, bedrock.webp, hero.png
assets/img/                logo.png, logo-192.png, banner.jpg (OG / favicons)
favicon.*, apple-touch-icon.png, site.webmanifest
robots.txt, sitemap.xml (GENERADO), vercel.json
```

Las URLs limpias (`/guias/economia`, sin `.html`) las da `"cleanUrls": true` de `vercel.json`.

## Editar las guías

El contenido vive **solo** en `tools/content/<slug>.html`. Los archivos de `guias/` se
generan y se sobrescriben, así que no se editan a mano.

```bash
# 1. edita tools/content/protecciones.html
# 2. regenera guias/, assets/wiki-index.js y sitemap.xml
python tools/build-guias.py
```

Para **añadir una guía nueva**: crea `tools/content/<slug>.html` y añade su línea a la
lista `PAGES` de `tools/build-guias.py` (slug, título, descripción, grupo del menú y
palabras clave del buscador). El menú lateral, el buscador, el enlace «siguiente», el
sitemap y los datos estructurados se actualizan solos.

### Piezas de maquetación disponibles

```html
<h2 id="ancla">Título de sección</h2>     <!-- el id alimenta el buscador -->
<div class="wk-cmds">
  <div class="wk-cmd"><code>/comando</code><p>Qué hace.</p>
    <span class="wk-ej">Ejemplo: <b>/comando algo</b></span></div>
</div>
<div class="wk-note">   <b>Título</b><p>…</p></div>   <!-- azul: información -->
<div class="wk-tip">    <b>Título</b><p>…</p></div>   <!-- verde: consejo -->
<div class="wk-warn">   <b>Título</b><p>…</p></div>   <!-- ámbar: cuidado -->
<div class="wk-bad">    <b>Título</b><p>…</p></div>   <!-- rojo: advertencia seria -->
<div class="wk-tablewrap"><table>…</table></div>      <!-- tabla con scroll en móvil -->
<div class="wk-grid"><a class="wk-card" href="…">
  <div class="wk-ico">Etiqueta</div><h3>Título</h3><p>…</p></a></div>
```

## Probar en local

```bash
python tools/serve-local.py        # http://127.0.0.1:8099 con URLs limpias
```

Después, con Playwright instalado (`npm i playwright`):

```bash
BASE=http://127.0.0.1:8099 node tools/audit-movil.mjs
```

Mide desbordamiento horizontal, zonas táctiles, errores de JS y comprueba el buscador en
320, 390, 393, 768 y 1440 px; deja capturas en `caps/` (no se versiona).

## La gráfica de jugadores

La portada dibuja **12 barras de 2 h** (24 h en total); la última es el bloque en curso y
muestra los jugadores conectados ahora mismo. Al pasar el ratón o tocar una barra sale
cuántos hubo en ese tramo.

Los datos salen de dos sitios que se combinan:

1. `data/players.json`, que escribe la tarea de GitHub Actions cada 2 h consultando
   `api.mcsrvstat.us`. Es el historial **compartido**: todos los visitantes ven lo mismo.
2. Las muestras que el propio navegador va guardando en `localStorage` mientras la
   página está abierta, que rellenan el bloque en curso.

Si la tarea no ha corrido todavía, la gráfica funciona igual con lo que haya.
Para añadir una muestra a mano: `python tools/muestra-jugadores.py`.

> La tarea necesita que el repositorio tenga **Actions con permiso de escritura**
> (Settings → Actions → General → Workflow permissions → *Read and write*).

## Aplicación instalable (PWA)

`site.webmanifest` + `sw.js` hacen que el sitio se pueda instalar en el móvil desde el
navegador y que **las guías se puedan leer sin conexión**. El service worker guarda las
17 páginas de guías y sus estáticos al instalarse; el HTML va por red primero y tira de
la copia solo si no hay internet.

Al cambiar el contenido hay que subir la versión en `sw.js` (`const VERSION = 'pmc-v1'`)
para que los navegadores descarten la caché vieja.

## Qué hace el JavaScript

- **index.html**: consulta `api.mcsrvstat.us` cada 30 s (jugadores, capacidad, versión),
  dibuja las barras de 24 h, copia la IP y abre el menú móvil.
- **assets/pwa.js**: registra el service worker y enseña el botón «Instalar» cuando el
  navegador lo permite (en iOS explica el gesto de «Añadir a pantalla de inicio»).
- **assets/wiki.js**: abre el índice lateral en móvil y resuelve el buscador contra
  `assets/wiki-index.js` (busca en páginas y secciones, ignorando tildes y mayúsculas,
  con `↑ ↓ Enter` y el atajo `/`).

## Publicar

- **Vercel**: importar el repo; no hay comando de build, la raíz es el sitio.
- `vercel.json` ya trae las cabeceras de seguridad, el CSP y `cleanUrls`.

## Analítica

GTM `GTM-M62PP28N` y GA4 `G-Q0E6MBKTMR` están en el `<head>` de todas las páginas.
