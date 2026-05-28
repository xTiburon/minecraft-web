async function loadAndApplyConfig() {
  try {
    const res    = await fetch('/data/config.json');
    const config = await res.json();
    applyLinks(config.links || {});
  } catch (e) {
    console.warn('[main] No se pudo cargar config.json. Usando links de respaldo.');
    applyLinks(_fallbackLinks());
  }
}

function applyLinks(links) {
  Object.entries(links).forEach(([key, url]) => {
    document.querySelectorAll(`[data-link="${key}"]`).forEach(el => { el.href = url; });
  });
}

function _fallbackLinks() {
  return {
    discord:          'https://discord.gg/HvcPfgXVHf',
    'discord-ticket': 'https://discord.gg/HvcPfgXVHf',
    shop:             'https://planet.tebex.io/',
    wiki:             'https://wiki.planetmc.net/',
    staff:            'https://forms.gle/po1fM57gG9oQtKCc7',
  };
}

/* ════ INTRO SCREEN ════ */
function initIntro() {
  const intro = document.getElementById('intro-screen');
  if (intro) setTimeout(() => intro.classList.add('hidden'), 2650);
}

/* ════ BOOT ════ */
document.addEventListener('DOMContentLoaded', async () => {
  await loadAndApplyConfig();  // 1. Links
  await initI18n();            // 2. Traducciones (js/i18n.js)
  await initServerStatus();    // 3. Estado servidor (js/status.js)
  initUI();                    // 4. Canvas, sprites, nav (js/ui.js)
  initIntro();                 // 5. Loading screen
});
