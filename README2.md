# PlanetMC — Estructura Modular

Servidor de Minecraft Java & Bedrock | planetmc.net

---

## 📁 Estructura del Proyecto

```
/project-root/
│
├── index.html              ← Página principal (landing)
├── site.webmanifest        ← PWA manifest
├── robots.txt              ← SEO robots
├── sitemap.xml             ← SEO sitemap
│
├── /assets/
│   ├── /img/               ← Imágenes (logo.png, banner.png, etc.)
│   │   ├── /icons/
│   │   └── /background/
│   ├── /css/
│   │   ├── main.css        ← Estilos base, variables, componentes
│   │   ├── animations.css  ← Keyframes y animaciones
│   │   └── responsive.css  ← Media queries
│   ├── /js/
│   │   ├── main.js         ← Inicialización core (intro, status)
│   │   ├── animations.js   ← Estrellas, polvo, sprites Minecraft
│   │   └── ui.js           ← Nav, scroll, copy IP, idiomas
│   └── /fonts/             ← Fuentes locales (opcional)
│
├── /config/
│   ├── links.js            ← ✏️ EDITA AQUÍ todos los enlaces
│   └── settings.js         ← ✏️ EDITA AQUÍ configuración global
│
├── /components/
│   ├── navbar.html         ← Navbar standalone (referencia)
│   ├── footer.html         ← Footer standalone (referencia)
│   └── seo.html            ← Meta tags SEO (referencia)
│
└── /pages/
    ├── soporte.html        ← Página de soporte
    ├── staff.html          ← Formulario de staff
    └── enlaces.html        ← Todos los enlaces oficiales
```

---

## ⚙️ Configuración rápida

### Cambiar enlaces

Edita `/config/links.js`:

```js
const LINKS = {
  discord: 'https://discord.gg/TU_SERVIDOR',
  shop:    'https://TU_TIENDA.tebex.io/',
  wiki:    'https://wiki.planetmc.net/',
  staff:   'https://forms.gle/TU_FORMULARIO',
};
```

### Cambiar estado del servidor

Edita `/config/settings.js`:

```js
serverStatus: 'online',       // muestra píldora verde
serverStatus: 'maintenance',  // muestra píldora roja
```

### Añadir imágenes

Coloca tus imágenes en `/assets/img/`:
- `logo.png`  → logo principal (512×512)
- `banner.png` → preview de redes sociales (1200×630)

---

## 🚀 Deploy en Vercel / GitHub Pages

1. Sube la carpeta completa a un repositorio GitHub.
2. Conecta el repositorio a Vercel (o activa GitHub Pages).
3. No se requiere build — es HTML/CSS/JS puro estático.

---

## ✅ Checklist de migración

- [x] CSS extraído a `/assets/css/` (main, animations, responsive)
- [x] JS extraído a `/assets/js/` (main, animations, ui)
- [x] Links centralizados en `/config/links.js`
- [x] Settings en `/config/settings.js`
- [x] Componentes en `/components/` (navbar, footer, seo)
- [x] Páginas en `/pages/` (soporte, staff, enlaces)
- [x] SEO intacto (meta, OG, Twitter, Schema.org, GTM, GA)
- [x] Rutas de imágenes actualizadas a `/assets/img/`
- [x] robots.txt y sitemap.xml incluidos
- [x] site.webmanifest incluido
- [x] Todo funcional sin errores de consola