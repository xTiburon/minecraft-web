/* config.js — Carga data/config.json y aplica enlaces dinámicos */

const FALLBACK_LINKS = {
  discord: 'https://discord.gg/HvcPfgXVHf',
  'discord-ticket': 'https://discord.gg/HvcPfgXVHf',
  shop: 'https://planetmc.tebex.io/',
  staff: 'https://forms.gle/po1fM57gG9oQtKCc7',
};

let cachedConfig = null;

export async function loadConfig() {
  if (cachedConfig) return cachedConfig;
  try {
    const res = await fetch('/data/config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`config.json ${res.status}`);
    cachedConfig = await res.json();
  } catch (e) {
    console.warn('[config] No se pudo cargar config.json, usando valores de respaldo.', e);
    cachedConfig = { links: FALLBACK_LINKS, server: { fallback_status: 'online' } };
  }
  return cachedConfig;
}

export function applyLinks(links) {
  const safeLinks = links || FALLBACK_LINKS;
  Object.entries(safeLinks).forEach(([key, url]) => {
    if (typeof url !== 'string' || !/^https?:\/\//.test(url)) return;
    document.querySelectorAll(`[data-link="${CSS.escape(key)}"]`).forEach((el) => {
      el.href = url;
    });
  });
}
