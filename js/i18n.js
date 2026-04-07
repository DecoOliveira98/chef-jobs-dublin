// ============================================================
// i18n.js — Chef Jobs Dublin
// Translations: English (en), Portuguese Brazil (pt-BR), Spanish (es)
// Must be loaded BEFORE app.js
// ============================================================

const TRANSLATIONS = {
  en: {
    // Nav
    nav_tagline:        "Dublin's #1 Chef Job Board",
    // Hero
    hero_eyebrow:       'Live Job Listings \u00b7 Dublin, Ireland',
    hero_title_1:       "Dublin's Home for",
    hero_title_2:       'Chef Careers',
    hero_tagline:       'From Commis to Executive Chef \u2014 every kitchen role in Dublin, aggregated live from the top job boards in Ireland.',
    search_placeholder: 'Search role, keyword, restaurant\u2026',
    search_btn:         'Find Jobs',
    stat_location_lbl:  'Focused Location',
    stat_levels_lbl:    'Chef Positions',
    stat_live_lbl:      'Updated on Load',
    // Filters
    filter_level:       'Chef Level',
    level_all:          'All Levels',
    level_commis:       'Commis Chef',
    level_cdp:          'Chef de Partie',
    level_sous:         'Sous Chef',
    level_head:         'Head Chef',
    level_exec:         'Executive Chef',
    level_pastry:       'Pastry Chef',
    level_porter:       'Kitchen Porter',
    // Jobs
    jobs_showing:       'Showing {n} role',
    jobs_showing_pl:    'Showing {n} roles',
    apply_btn:          'Apply Now',
    salary_unknown:     'Salary not listed',
    date_today:         'Today',
    date_yesterday:     'Yesterday',
    date_days:          '{n}d ago',
    date_weeks:         '{n}w ago',
    // Empty / error
    empty_title:        'No roles found',
    empty_text:         'Try adjusting your filters or search keyword.',
    error_title:        'Could not load jobs',
    error_text:         'Check your API keys in js/config.js and serve via a local HTTP server.',
    // Footer
    footer_sourced:     'Jobs sourced from',
    footer_and:         '&',
  },

  'pt-BR': {
    nav_tagline:        'N\u00ba 1 em Vagas de Chef em Dublin',
    hero_eyebrow:       'Vagas em Tempo Real \u00b7 Dublin, Irlanda',
    hero_title_1:       'O Lar das Carreiras de',
    hero_title_2:       'Chef em Dublin',
    hero_tagline:       'Do Commis ao Chef Executivo \u2014 todas as vagas de cozinha em Dublin, agregadas ao vivo dos melhores sites de emprego da Irlanda.',
    search_placeholder: 'Buscar cargo, palavra-chave, restaurante\u2026',
    search_btn:         'Buscar Vagas',
    stat_location_lbl:  'Localiza\u00e7\u00e3o',
    stat_levels_lbl:    'Posi\u00e7\u00f5es de Chef',
    stat_live_lbl:      'Atualizado ao Carregar',
    filter_level:       'N\u00edvel do Chef',
    level_all:          'Todos os N\u00edveis',
    level_commis:       'Commis Chef',
    level_cdp:          'Chef de Partie',
    level_sous:         'Sous Chef',
    level_head:         'Head Chef',
    level_exec:         'Chef Executivo',
    level_pastry:       'Chef Confeiteiro',
    level_porter:       'Auxiliar de Cozinha',
    jobs_showing:       'Mostrando {n} vaga',
    jobs_showing_pl:    'Mostrando {n} vagas',
    apply_btn:          'Candidatar-se',
    salary_unknown:     'Sal\u00e1rio n\u00e3o informado',
    date_today:         'Hoje',
    date_yesterday:     'Ontem',
    date_days:          'h\u00e1 {n}d',
    date_weeks:         'h\u00e1 {n}sem',
    empty_title:        'Nenhuma vaga encontrada',
    empty_text:         'Tente ajustar seus filtros ou palavra-chave de busca.',
    error_title:        'N\u00e3o foi poss\u00edvel carregar as vagas',
    error_text:         'Verifique suas chaves de API em js/config.js e abra via servidor HTTP local.',
    footer_sourced:     'Vagas de',
    footer_and:         'e',
  },

  es: {
    nav_tagline:        'El n\u00ba 1 en Empleos de Chef en Dubl\u00edn',
    hero_eyebrow:       'Empleos en Tiempo Real \u00b7 Dubl\u00edn, Irlanda',
    hero_title_1:       'El Hogar de las Carreras de',
    hero_title_2:       'Chef en Dubl\u00edn',
    hero_tagline:       'Desde Commis hasta Chef Ejecutivo \u2014 todos los puestos de cocina en Dubl\u00edn, agregados en vivo desde los mejores portales de empleo de Irlanda.',
    search_placeholder: 'Buscar puesto, palabra clave, restaurante\u2026',
    search_btn:         'Buscar Empleos',
    stat_location_lbl:  'Ubicaci\u00f3n',
    stat_levels_lbl:    'Posiciones de Chef',
    stat_live_lbl:      'Actualizado al Cargar',
    filter_level:       'Nivel de Chef',
    level_all:          'Todos los Niveles',
    level_commis:       'Commis Chef',
    level_cdp:          'Chef de Partie',
    level_sous:         'Sous Chef',
    level_head:         'Head Chef',
    level_exec:         'Chef Ejecutivo',
    level_pastry:       'Chef Pastelero',
    level_porter:       'Auxiliar de Cocina',
    jobs_showing:       'Mostrando {n} empleo',
    jobs_showing_pl:    'Mostrando {n} empleos',
    apply_btn:          'Aplicar Ahora',
    salary_unknown:     'Salario no indicado',
    date_today:         'Hoy',
    date_yesterday:     'Ayer',
    date_days:          'hace {n}d',
    date_weeks:         'hace {n}sem',
    empty_title:        'No se encontraron empleos',
    empty_text:         'Intenta ajustar tus filtros o la palabra clave de b\u00fasqueda.',
    error_title:        'No se pudieron cargar los empleos',
    error_text:         'Verifica tus claves de API en js/config.js y abre desde un servidor HTTP local.',
    footer_sourced:     'Empleos de',
    footer_and:         'y',
  },
};

// Active language — read from localStorage or default to 'en'
let currentLang = localStorage.getItem('cjd_lang') || 'en';

// t(key, vars) — translate a key, optionally interpolate {n} etc.
function t(key, vars) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
  let str = dict[key] || TRANSLATIONS['en'][key] || key;
  if (vars) {
    Object.keys(vars).forEach(function(k) {
      str = str.replace('{' + k + '}', vars[k]);
    });
  }
  return str;
}

// Pluralise helper — uses jobs_showing vs jobs_showing_pl
function tCount(n) {
  return t(n === 1 ? 'jobs_showing' : 'jobs_showing_pl', { n: n });
}

// Apply translations to all [data-i18n] and [data-i18n-ph] elements
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.documentElement.lang = currentLang;
  // Update active button
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('lang-btn--active', btn.dataset.lang === currentLang);
  });
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('cjd_lang', lang);
  applyTranslations();
  // Re-render chips and job grid with new language (app.js exposes these)
  if (typeof renderLevelChips === 'function') renderLevelChips();
  if (typeof render === 'function') render();
}

// Wire up switcher buttons once DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { setLanguage(btn.dataset.lang); });
  });
  applyTranslations();
});
