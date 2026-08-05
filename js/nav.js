/* nav.js — Menú móvil y animación de aparición al hacer scroll */

export function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach((el) => obs.observe(el));
}

export function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navMobileMenu = document.getElementById('navMobileMenu');
  if (!navToggle || !navMobileMenu) return;

  const setOpen = (open) => {
    navMobileMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.innerHTML = open
      ? '<i class="fas fa-times" aria-hidden="true"></i>'
      : '<i class="fas fa-bars" aria-hidden="true"></i>';
  };

  navToggle.addEventListener('click', () => {
    setOpen(!navMobileMenu.classList.contains('open'));
  });

  navMobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

export function initEditionCards() {
  document.querySelectorAll('.edition-card').forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
}

export function initImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const targetId = img.dataset.fallback;
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) target.style.display = 'flex';
      }
    });
  });
}
