/* clipboard.js — Copiar IP con notificación toast */

function showToast(message) {
  const toast = document.getElementById('ipToast');
  if (!toast) return;
  toast.textContent = '';
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('width', '14'); icon.setAttribute('height', '14');
  icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor'); icon.setAttribute('stroke-width', '3');
  icon.setAttribute('stroke-linecap', 'round'); icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('aria-hidden', 'true');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  poly.setAttribute('points', '20 6 9 17 4 12');
  icon.appendChild(poly);
  toast.appendChild(icon);
  toast.appendChild(document.createTextNode(message));
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (e) { /* noop */ }
  document.body.removeChild(ta);
}

export function copyText(text, message) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(message)).catch(() => {
      fallbackCopy(text); showToast(message);
    });
  } else {
    fallbackCopy(text); showToast(message);
  }
}

export function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', () => {
      copyText(el.dataset.copy, el.dataset.copyMsg || 'Copiado al portapapeles');
    });
  });
}
