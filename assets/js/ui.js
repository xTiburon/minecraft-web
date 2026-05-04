/**
 * PlanetMC — assets/js/ui.js
 * UI interactions: nav, scroll, reveal, copy IP, language switcher.
 */

/* ════ SCROLL PROGRESS BAR ════ */
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100;
  const line = document.getElementById('scrollLine');
  if (line) line.style.width = pct + '%';
}, { passive: true });


/* ════ SCROLL REVEAL ════ */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .10 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ════ NAV ACTIVE LINK ════ */
(function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, { passive: true });
})();


/* ════ MOBILE NAV TOGGLE ════ */
(function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.innerHTML = open
      ? '<i class="fas fa-times" aria-hidden="true"></i>'
      : '<i class="fas fa-bars" aria-hidden="true"></i>';
  });

  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    })
  );
})();


/* ════ COPY IP ════ */
function copyText(text, message) {
  const showToast = () => {
    const t = document.getElementById('ipToast');
    if (!t) return;
    t.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>${message}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showToast).catch(() => {
      fallbackCopy(text); showToast();
    });
  } else {
    fallbackCopy(text); showToast();
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (e) { /* silent fail */ }
  document.body.removeChild(ta);
}

/* Keyboard access for clickable blocks */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ip-block, .edition-card').forEach(b => {
    b.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
    });
  });
});


/* ════ i18n LANGUAGE SWITCHER ════ */
const translations = {
  es: {
    intro_tagline:        'Servidor Minecraft Java & Bedrock',
    nav_inicio:           'INICIO',
    nav_soporte:          'SOPORTE',
    nav_staff:            'ÚNETE AL STAFF',
    hero_sub:             'Únete a la comunidad más épica. Aventuras, rangos, eventos y mucho más te esperan en el servidor.',
    status_online:        'SERVIDOR EN LÍNEA',
    status_maintenance:   'SERVIDOR EN MANTENIMIENTO',
    java_sub:             'Edición para PC y escritorio',
    bedrock_sub:          'Edición para consolas y móviles',
    cta_discord:          'Únete a nuestra comunidad',
    cta_shop_name:        'TIENDA',
    cta_shop:             'Artículos y beneficios exclusivos',
    cta_wiki:             'Normas y guías del servidor',
    support_label:        'AYUDA',
    support_heading:      'Centro de Soporte',
    support_desc:         '¿Tienes algún problema? Estamos aquí para solucionarlo.',
    s1_title:             'Ticket en Discord',
    s1_desc:              'Abre un ticket en nuestro servidor de Discord para soporte personalizado y rápido.',
    s2_title:             'Reportar Jugador',
    s2_desc:              'Reporta comportamientos que violen las normas del servidor con pruebas.',
    s3_title:             'Reportar Bug',
    s3_desc:              '¿Encontraste un error o glitch? Repórtalo para que lo solucionemos.',
    s4_title:             'Soporte de Compras',
    s4_desc:              '¿Problemas con tu pago o rango no entregado? Contáctanos con tu comprobante.',
  },
  en: {
    intro_tagline:        'Minecraft Java & Bedrock Server',
    nav_inicio:           'HOME',
    nav_soporte:          'SUPPORT',
    nav_staff:            'JOIN THE STAFF',
    hero_sub:             'Join the most epic community. Adventures, ranks, events and much more await you on the server.',
    status_online:        'SERVER ONLINE',
    status_maintenance:   'SERVER UNDER MAINTENANCE',
    java_sub:             'Edition for PC and desktop',
    bedrock_sub:          'Edition for consoles and mobile',
    cta_discord:          'Join our community',
    cta_shop_name:        'SHOP',
    cta_shop:             'Exclusive items and benefits',
    cta_wiki:             'Server rules and guides',
    support_label:        'HELP',
    support_heading:      'Support Center',
    support_desc:         'Having a problem? We are here to solve it.',
    s1_title:             'Discord Ticket',
    s1_desc:              'Open a ticket on our Discord server for personalized and fast support.',
    s2_title:             'Report Player',
    s2_desc:              'Report behavior that violates server rules with evidence.',
    s3_title:             'Report Bug',
    s3_desc:              'Found an error or glitch? Report it so we can fix it.',
    s4_title:             'Purchase Support',
    s4_desc:              'Problems with your payment or rank not delivered? Contact us with your receipt.',
  },
  pt: {
    intro_tagline:        'Servidor Minecraft Java & Bedrock',
    nav_inicio:           'INÍCIO',
    nav_soporte:          'SUPORTE',
    nav_staff:            'JUNTE-SE AO STAFF',
    hero_sub:             'Junte-se à comunidade mais épica. Aventuras, ranks, eventos e muito mais te esperam no servidor.',
    status_online:        'SERVIDOR ONLINE',
    status_maintenance:   'SERVIDOR EM MANUTENÇÃO',
    java_sub:             'Edição para PC e desktop',
    bedrock_sub:          'Edição para consoles e mobile',
    cta_discord:          'Entre em nossa comunidade',
    cta_shop_name:        'LOJA',
    cta_shop:             'Itens e benefícios exclusivos',
    cta_wiki:             'Regras e guias do servidor',
    support_label:        'AJUDA',
    support_heading:      'Central de Suporte',
    support_desc:         'Tem algum problema? Estamos aqui para resolvê-lo.',
    s1_title:             'Ticket no Discord',
    s1_desc:              'Abra um ticket em nosso servidor do Discord para suporte personalizado e rápido.',
    s2_title:             'Reportar Jogador',
    s2_desc:              'Reporte comportamentos que violem as regras do servidor com evidências.',
    s3_title:             'Reportar Bug',
    s3_desc:              'Encontrou um erro ou glitch? Reporte para que possamos corrigir.',
    s4_title:             'Suporte de Compras',
    s4_desc:              'Problemas com seu pagamento ou rank não entregue? Entre em contato com seu comprovante.',
  },
};

let currentLang = localStorage.getItem('pmc_lang')
  || (typeof SETTINGS !== 'undefined' ? SETTINGS.defaultLang : 'es');

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('pmc_lang', lang);
  document.documentElement.lang = lang;
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

/* Apply on load */
document.addEventListener('DOMContentLoaded', () => setLang(currentLang));
