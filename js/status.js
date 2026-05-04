/* ════════════════════════════════════════════════
   status.js — Estado del servidor / Lógica dinámica
   PlanetMC
   ════════════════════════════════════════════════ */

/**
 * Inicializa el estado del servidor leyendo config.json.
 * Si el status es 'maintenance', muestra la pill de mantenimiento.
 * Si es cualquier otro valor, muestra la pill de online.
 */
async function initServerStatus() {
  try {
    const res = await fetch('/data/config.json');
    const config = await res.json();
    applyServerStatus(config.server?.status || 'online');
  } catch (e) {
    console.warn('[status] No se pudo cargar config.json, mostrando estado online por defecto.');
    applyServerStatus('online');
  }
}

/**
 * Muestra u oculta las pills de estado según el valor recibido.
 * @param {'online'|'maintenance'} status
 */
function applyServerStatus(status) {
  const onlinePill      = document.querySelector('.ip-online-pill');
  const maintenancePill = document.querySelector('.ip-maintenance-pill');

  if (!onlinePill && !maintenancePill) return; // Elementos no encontrados

  if (status === 'maintenance') {
    if (onlinePill)      onlinePill.style.display      = 'none';
    if (maintenancePill) maintenancePill.style.display  = 'inline-flex';
  } else {
    if (onlinePill)      onlinePill.style.display       = 'inline-flex';
    if (maintenancePill) maintenancePill.style.display  = 'none';
  }
}