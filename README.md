# planetmc.net

Sitio estático de PlanetMC (una sola página, sin build ni dependencias).

## Estructura

```
index.html          la página completa (HTML + CSS inline + JS al final)
assets/             logo.webp, java.webp, bedrock.webp, hero.png
assets/img/         logo.png, logo-192.png, banner.jpg (OG / favicons)
favicon.*, apple-touch-icon.png, site.webmanifest
robots.txt, sitemap.xml, vercel.json
googleacab617ec31b61fd.html   verificación de Google Search Console
```

## Subirlo a GitHub

```bash
git init
git add .
git commit -m "Rediseño minimalista del sitio"
git branch -M main
git remote add origin git@github.com:USUARIO/REPO.git
git push -u origin main
```

- **GitHub Pages**: Settings → Pages → Deploy from a branch → `main` / `root`.
- **Vercel / Netlify**: importar el repo; no hay comando de build, la raíz es el sitio.
- Si el sitio no va en la raíz del dominio (por ejemplo `usuario.github.io/REPO/`), cambia `/favicon.ico`, `/apple-touch-icon.png`, `/site.webmanifest` y `/assets/img/logo-192.png` a rutas relativas (`favicon.ico`, etc.) en el `<head>` de `index.html`.

## Qué hace el JavaScript del final de index.html

- Consulta `api.mcsrvstat.us` cada 30 s: jugadores online, capacidad, versión y lista de conectados.
- Guarda una muestra por bloque de 2 h en `localStorage` y dibuja la gráfica de 24 h (pico por bloque) con tooltip al pasar el mouse o el dedo.
- Copiar IP (Java y Bedrock) con aviso, y menú móvil.

### Historial real compartido (opcional)

Hoy el historial vive en el navegador de cada visitante, así que un visitante nuevo ve las muestras en vivo hasta acumular 2 bloques. Para que todos vean las mismas 24 h: registra el conteo en tu servidor cada 2 h y expón un JSON tipo
`[{"t":1731000000000,"n":42}, ...]`; luego en `index.html` reemplaza `loadSamples()` por un `fetch` a ese endpoint.

## Analítica

GTM `GTM-M62PP28N` y GA4 `G-Q0E6MBKTMR` ya están en el `<head>`.
