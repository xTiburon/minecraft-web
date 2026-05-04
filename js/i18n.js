/* ════════════════════════════════════════════════
   i18n.js — Internacionalización / Traducciones
   PlanetMC
   ════════════════════════════════════════════════ */

let translations = {};
let currentLang = localStorage.getItem('pmc_lang') || 'es';

/**
 * Carga las traducciones desde data/translations.json
 * y aplica el idioma guardado.
 */
async function initI18n() {
  try {
    const res = await fetch('/data/translations.json');
    translations = await res.json();
  } catch (e) {
    console.warn('[i18n] No se pudo cargar translations.json, usando fallback embebido.');
    translations = _fallbackTranslations();
  }
  setLang(currentLang);
}

/**
 * Aplica el idioma indicado a todos los elementos [data-i18n].
 * Actualiza el atributo lang del documento y el estado de los botones.
 * @param {string} lang - Código de idioma: 'es' | 'en' | 'pt'
 */
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('pmc_lang', lang);
  document.documentElement.lang = lang;

  const t = translations[lang] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

/**
 * Traducciones de respaldo en caso de que el JSON no cargue.
 */
function _fallbackTranslations() {
  return {
    es: {
      intro_tagline:       'Servidor Minecraft Java & Bedrock',
      nav_ticket:          'ABRIR TICKET',
      nav_staff:           'ÚNETE AL STAFF',
      hero_sub:            'Vive la mejor experiencia y forma parte de la comunidad donde la diversión nunca falta.',
      status_online:       'SERVIDOR EN LÍNEA',
      status_maintenance:  'SERVIDOR EN MANTENIMIENTO',
      java_sub:            'Edición para PC y escritorio',
      bedrock_sub:         'Edición para consolas y móviles',
      cta_discord:         'Únete a nuestra comunidad',
      cta_shop_name:       'TIENDA',
      cta_shop:            'Rangos y beneficios exclusivos',
      cta_wiki:            'Normas y guías del servidor',
    },
    en: {
      intro_tagline:       'Minecraft Java & Bedrock Server',
      nav_ticket:          'OPEN TICKET',
      nav_staff:           'JOIN THE STAFF',
      hero_sub:            'Live the best experience and be part of the community where the fun never stops.',
      status_online:       'SERVER ONLINE',
      status_maintenance:  'SERVER UNDER MAINTENANCE',
      java_sub:            'Edition for PC and desktop',
      bedrock_sub:         'Edition for consoles and mobile',
      cta_discord:         'Join our community',
      cta_shop_name:       'SHOP',
      cta_shop:            'Ranks and exclusive benefits',
      cta_wiki:            'Server rules and guides',
    },
    pt: {
      intro_tagline:       'Servidor Minecraft Java & Bedrock',
      nav_ticket:          'ABRIR TICKET',
      nav_staff:           'JUNTE-SE AO STAFF',
      hero_sub:            'Viva a melhor experiência e faça parte da comunidade onde a diversão nunca para.',
      status_online:       'SERVIDOR ONLINE',
      status_maintenance:  'SERVIDOR EM MANUTENÇÃO',
      java_sub:            'Edição para PC e desktop',
      bedrock_sub:         'Edição para consoles e celular',
      cta_discord:         'Entre em nossa comunidade',
      cta_shop_name:       'LOJA',
      cta_shop:            'Cargos e benefícios exclusivos',
      cta_wiki:            'Regras e guias do servidor',
    }
  };
}