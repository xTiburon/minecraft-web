/**
 * PlanetMC — assets/js/main.js
 * Core initialization: intro screen, component loader, server status.
 */

/* ════ INTRO SCREEN ════ */
(function initIntro() {
  const intro    = document.getElementById('intro-screen');
  if (!intro) return;
  const duration = (typeof SETTINGS !== 'undefined') ? SETTINGS.introDuration : 2650;
  setTimeout(() => intro.classList.add('hidden'), duration);
})();


/* ════ SERVER STATUS (driven by SETTINGS.serverStatus) ════ */
(function applyServerStatus() {
  if (typeof SETTINGS === 'undefined') return;
  const onlineEl      = document.getElementById('status-online');
  const maintenanceEl = document.getElementById('status-maintenance');
  if (!onlineEl || !maintenanceEl) return;

  if (SETTINGS.serverStatus === 'maintenance') {
    onlineEl.style.display      = 'none';
    maintenanceEl.style.display = 'inline-flex';
  } else {
    onlineEl.style.display      = 'inline-flex';
    maintenanceEl.style.display = 'none';
  }
})();


/* ════ COMPONENT LOADER ════ */
/**
 * Loads an HTML component file and injects it into a target element.
 * @param {string} selector  - CSS selector for the container element
 * @param {string} url       - Path to the HTML component file
 * @param {Function} [cb]    - Optional callback after injection
 */
async function loadComponent(selector, url, cb) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const html = await res.text();
    el.innerHTML = html;
    if (typeof cb === 'function') cb(el);
  } catch (err) {
    console.warn('[PlanetMC] Component load error:', err);
  }
}


/* ════ LOAD NAVBAR & FOOTER ════ */
document.addEventListener('DOMContentLoaded', async () => {
  // Components are embedded directly in index.html for reliability on static hosts.
  // If you move to a server that supports includes, uncomment and use loadComponent:
  //
  // await loadComponent('#navbar-placeholder', '/components/navbar.html', () => {
  //   // Re-init nav after injection
  // });
  // await loadComponent('#footer-placeholder', '/components/footer.html');
});
