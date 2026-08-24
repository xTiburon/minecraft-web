/* main.js — Punto de entrada. Orquesta la inicialización de la página. */

import { loadConfig, applyLinks } from './config.js';
import { initBackground } from './background.js';
import { initReveal, initMobileNav, initEditionCards, initImageFallbacks } from './nav.js';
import { initCopyButtons } from './clipboard.js';
import { initServerStatus } from './server-status.js';
import { initStaff } from './staff.js';

async function boot() {
  const config = await loadConfig();
  applyLinks(config.links);

  initBackground();
  initReveal();
  initMobileNav();
  initEditionCards();
  initImageFallbacks();
  initCopyButtons();
  initServerStatus(config);

  await initStaff();
  initReveal(); // vuelve a observar las tarjetas de staff insertadas dinámicamente
}

document.addEventListener('DOMContentLoaded', boot);
