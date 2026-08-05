/* staff.js — Renderiza la jerarquía del equipo desde data/staff.json */

function buildStaffCard(rank) {
  const card = document.createElement('article');
  card.className = 'staff-card reveal';
  card.style.setProperty('--staff-color', rank.accent || 'var(--cyan)');

  const icon = document.createElement('div');
  icon.className = 'staff-icon';
  icon.setAttribute('aria-hidden', 'true');
  const i = document.createElement('i');
  i.className = `fas ${rank.icon || 'fa-star'}`;
  icon.appendChild(i);

  const title = document.createElement('h3');
  title.textContent = rank.rank || 'Staff';

  const desc = document.createElement('p');
  desc.className = 'staff-desc';
  desc.textContent = rank.description || '';

  const members = document.createElement('div');
  members.className = 'staff-members';
  const list = Array.isArray(rank.members) && rank.members.length ? rank.members : [{ name: 'Por asignar' }];
  list.forEach((m) => {
    const item = document.createElement('div');
    const name = (m && m.name) || 'Por asignar';
    item.className = name === 'Por asignar' ? 'staff-member placeholder' : 'staff-member';
    item.textContent = name;
    members.appendChild(item);
  });

  card.append(icon, title, desc, members);
  return card;
}

export async function initStaff() {
  const grid = document.getElementById('staffGrid');
  if (!grid) return;

  try {
    const res = await fetch('/data/staff.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`staff.json ${res.status}`);
    const ranks = await res.json();
    grid.textContent = '';
    ranks.forEach((rank) => grid.appendChild(buildStaffCard(rank)));
  } catch (e) {
    console.warn('[staff] No se pudo cargar la lista del staff.', e);
    grid.innerHTML = '<p class="players-empty">No se pudo cargar el equipo del staff en este momento.</p>';
  }
}
