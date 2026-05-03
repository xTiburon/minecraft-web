/**
 * PlanetMC — config/links.js
 * Centralized link configuration.
 * Edit this file to update all links across the site.
 */

const LINKS = {
  discord: 'https://discord.gg/HvcPfgXVHf',         // 💬 Discord server
  shop:    'https://planet.tebex.io/',                // 🛒 Store / Tienda
  wiki:    'https://wiki.planetmc.net/',              // 📖 Wiki
  staff:   'https://forms.gle/po1fM57gG9oQtKCc7',    // ⭐ Staff application form
};

/**
 * Apply links to all elements with [data-link] attributes.
 * Called automatically on DOMContentLoaded.
 */
function applyLinks() {
  document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.getAttribute('data-link');
    if (LINKS[key]) el.href = LINKS[key];
  });
}

document.addEventListener('DOMContentLoaded', applyLinks);