/* server-status.js — Estado del servidor y jugadores conectados en tiempo real
   Fuente: api.mcsrvstat.us (API pública, gratuita, sin necesidad de backend propio) */

const REFRESH_MS = 30_000;
const FETCH_TIMEOUT_MS = 8_000;
const AVATAR_BASE = 'https://mc-heads.net/avatar';

function withTimeout(promise, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return promise(ctrl.signal).finally(() => clearTimeout(timer));
}

async function fetchStatus(apiUrl) {
  return withTimeout(
    (signal) => fetch(apiUrl, { signal, cache: 'no-store' }).then((r) => {
      if (!r.ok) throw new Error(`status api ${r.status}`);
      return r.json();
    }),
    FETCH_TIMEOUT_MS,
  );
}

function setPill(state) {
  const pills = document.querySelectorAll('.status-pill');
  pills.forEach((pill) => {
    pill.classList.remove('is-online', 'is-offline', 'is-loading');
    pill.classList.add(`is-${state}`);
    const label = pill.querySelector('.pill-label');
    if (label) {
      label.textContent = state === 'online'
        ? 'Servidor en línea'
        : state === 'offline'
          ? 'Servidor sin conexión'
          : 'Consultando servidor…';
    }
  });
}

function setStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderPlayers(list) {
  const container = document.getElementById('playersList');
  if (!container) return;
  container.textContent = '';

  if (!Array.isArray(list) || list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'players-empty';
    empty.textContent = 'El servidor no publica la lista de jugadores en este momento.';
    container.appendChild(empty);
    return;
  }

  list.slice(0, 40).forEach((entry) => {
    const name = typeof entry === 'string' ? entry : entry?.name;
    if (!name || !/^[A-Za-z0-9_]{1,16}$/.test(name)) return; // nombres válidos de Minecraft

    const chip = document.createElement('span');
    chip.className = 'player-chip';

    const avatar = document.createElement('img');
    avatar.src = `${AVATAR_BASE}/${encodeURIComponent(name)}/32`;
    avatar.alt = '';
    avatar.width = 20; avatar.height = 20;
    avatar.loading = 'lazy';
    avatar.referrerPolicy = 'no-referrer';
    avatar.onerror = () => { avatar.style.display = 'none'; };

    const label = document.createElement('span');
    label.textContent = name;

    chip.appendChild(avatar);
    chip.appendChild(label);
    container.appendChild(chip);
  });
}

async function refreshStatus(config) {
  const apiUrl = config?.server?.status_api;
  if (!apiUrl) { setPill('online'); return; }

  try {
    const data = await fetchStatus(apiUrl);
    const online = Boolean(data.online);
    setPill(online ? 'online' : 'offline');

    setStat('statPlayers', online ? String(data.players?.online ?? 0) : '0');
    setStat('statMax', online ? String(data.players?.max ?? '—') : '—');
    setStat('statVersion', online ? (data.version || '—') : '—');

    const badge = document.getElementById('playersCountBadge');
    if (badge) badge.textContent = online ? `${data.players?.online ?? 0} / ${data.players?.max ?? '—'}` : '0 / —';

    renderPlayers(online ? data.players?.list : []);
  } catch (e) {
    console.warn('[server-status] No se pudo consultar el estado del servidor.', e);
    setPill('offline');
    setStat('statPlayers', '—');
    setStat('statMax', '—');
    setStat('statVersion', '—');
    renderPlayers([]);
  }
}

export function initServerStatus(config) {
  setPill('loading');
  refreshStatus(config);
  setInterval(() => refreshStatus(config), REFRESH_MS);
}
