// ============================================================
// i18n.js — Chef Jobs Dublin
// Translations: English (en), Portuguese Brazil (pt-BR), Spanish (es)
// Must be loaded BEFORE app.js
// ============================================================

const TRANSLATIONS = {
  en: {
    // Nav
    nav_jobs:           'Jobs',
    nav_infohub:        'Info Hub',
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

    // ---- Info Hub ----
    ih_hero_title:      'Your Dublin Chef Career Hub',
    ih_hero_sub:        'Industry news, career tips and essential resources — everything a chef needs to thrive in Dublin.',
    ih_news_title:      'Industry News',
    ih_news_sub:        'Latest from the Irish hospitality & culinary scene',
    ih_news_read:       'Read Article',
    ih_news_empty:      'No news available right now. Check back soon.',
    ih_news_error:      'Could not load news.',
    ih_articles_title:  'Chef Tips & Stories',
    ih_articles_sub:    'Posts written by the team — career advice, Dublin life, kitchen culture',
    ih_articles_read:   'Read Post',
    ih_articles_cta:    'Write on Dev.to \u2192',
    ih_articles_empty_title: 'No posts yet',
    ih_articles_empty_text:  'Be the first \u2014 write your story on Dev.to and it will appear here automatically.',
    ih_min_read:        'min read',
    ih_resources_title: 'Dublin Resources',
    ih_resources_sub:   'Practical info for chefs living and working in Dublin',
    // Salary Guide
    ih_salary_title:    'Salary Guide',
    ih_salary_sub:      'Average annual salaries for chef roles in Dublin (2025)',
    ih_salary_note:     'Figures are estimates based on market data. Actual salaries vary by employer and experience.',
    // PPS
    ih_pps_title:       'PPS Number Guide',
    ih_pps_sub:         'You need a PPSN to work legally in Ireland',
    ih_pps_s1:          'Book an appointment at your local Intreo Centre or DSP office',
    ih_pps_s2:          'Bring your passport (or national ID for EU citizens)',
    ih_pps_s3:          'Bring proof of address (utility bill, bank letter, lease)',
    ih_pps_s4:          'Bring proof of why you need a PPSN (employment offer letter)',
    ih_pps_s5:          'Processing takes 1\u20135 working days',
    ih_pps_link:        'Find your nearest Intreo Centre \u2192',
    // Cost of Living
    ih_col_title:       'Cost of Living',
    ih_col_sub:         'Monthly estimates for a single person in Dublin',
    ih_col_room:        'Room (shared house)',
    ih_col_studio:      'Studio apartment',
    ih_col_transport:   'Monthly transport (Leap Card)',
    ih_col_groceries:   'Groceries',
    ih_col_eating_out:  'Eating out (budget)',
    ih_col_note:        'Dublin is one of the most expensive cities in the EU. Shared accommodation is strongly recommended when starting out.',
    // Visa
    ih_visa_title:      'Working in Ireland',
    ih_visa_eu:         'EU / EEA Citizens',
    ih_visa_eu_text:    'No visa or permit needed. You have the right to live and work freely in Ireland.',
    ih_visa_noneu:      'Non-EU Citizens',
    ih_visa_noneu_text: 'A work permit is required. The most common for skilled chefs is the Critical Skills Employment Permit (salary \u2265 \u20ac32,000/yr).',
    ih_visa_br:         'Brazilian Citizens',
    ih_visa_br_text:    'Ireland and Brazil have a Working Holiday Agreement. Brazilians aged 18\u201335 can apply for a 1-year working holiday visa.',
    ih_visa_link:       'Check visa requirements on DEASP \u2192',
  },

  'pt-BR': {
    nav_jobs:           'Vagas',
    nav_infohub:        'Info Hub',
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

    // ---- Info Hub ----
    ih_hero_title:      'Seu Hub de Carreira de Chef em Dublin',
    ih_hero_sub:        'Not\u00edcias do setor, dicas de carreira e recursos essenciais \u2014 tudo que um chef precisa para crescer em Dublin.',
    ih_news_title:      'Not\u00edcias do Setor',
    ih_news_sub:        '\u00daltimas do cen\u00e1rio de hospitalidade e culin\u00e1ria irlandesa',
    ih_news_read:       'Ler Artigo',
    ih_news_empty:      'Nenhuma not\u00edcia dispon\u00edvel agora. Volte em breve.',
    ih_news_error:      'N\u00e3o foi poss\u00edvel carregar as not\u00edcias.',
    ih_articles_title:  'Dicas & Hist\u00f3rias de Chefs',
    ih_articles_sub:    'Posts escritos pela equipe \u2014 conselhos de carreira, vida em Dublin, cultura de cozinha',
    ih_articles_read:   'Ler Post',
    ih_articles_cta:    'Escrever no Dev.to \u2192',
    ih_articles_empty_title: 'Nenhum post ainda',
    ih_articles_empty_text:  'Seja o primeiro \u2014 escreva sua hist\u00f3ria no Dev.to e ela aparecer\u00e1 aqui automaticamente.',
    ih_min_read:        'min de leitura',
    ih_resources_title: 'Recursos em Dublin',
    ih_resources_sub:   'Informa\u00e7\u00f5es pr\u00e1ticas para chefs vivendo e trabalhando em Dublin',
    ih_salary_title:    'Guia de Sal\u00e1rios',
    ih_salary_sub:      'Sal\u00e1rios anuais m\u00e9dios para chefs em Dublin (2025)',
    ih_salary_note:     'Valores estimados com base em dados de mercado. Sal\u00e1rios reais variam conforme empregador e experi\u00eancia.',
    ih_pps_title:       'Guia do N\u00famero PPS',
    ih_pps_sub:         'Voc\u00ea precisa de um PPSN para trabalhar legalmente na Irlanda',
    ih_pps_s1:          'Agende uma consulta no seu Intreo Centre ou escrit\u00f3rio DSP mais pr\u00f3ximo',
    ih_pps_s2:          'Leve seu passaporte (ou ID nacional para cidad\u00e3os da UE)',
    ih_pps_s3:          'Leve comprovante de endere\u00e7o (conta de servi\u00e7os, carta do banco, contrato de aluguel)',
    ih_pps_s4:          'Leve comprovante da necessidade do PPSN (carta de oferta de emprego)',
    ih_pps_s5:          'O processamento leva de 1 a 5 dias \u00fateis',
    ih_pps_link:        'Encontrar o Intreo Centre mais pr\u00f3ximo \u2192',
    ih_col_title:       'Custo de Vida',
    ih_col_sub:         'Estimativas mensais para uma pessoa em Dublin',
    ih_col_room:        'Quarto (casa compartilhada)',
    ih_col_studio:      'Apartamento studio',
    ih_col_transport:   'Transporte mensal (Cart\u00e3o Leap)',
    ih_col_groceries:   'Alimenta\u00e7\u00e3o (mercado)',
    ih_col_eating_out:  'Comer fora (econômico)',
    ih_col_note:        'Dublin \u00e9 uma das cidades mais caras da UE. Moradia compartilhada \u00e9 muito recomendada no in\u00edcio.',
    ih_visa_title:      'Trabalhar na Irlanda',
    ih_visa_eu:         'Cidad\u00e3os UE / EEE',
    ih_visa_eu_text:    'Sem necessidade de visto. Voc\u00ea tem direito a viver e trabalhar livremente na Irlanda.',
    ih_visa_noneu:      'Cidad\u00e3os fora da UE',
    ih_visa_noneu_text: '\u00c9 necess\u00e1ria autoriza\u00e7\u00e3o de trabalho. A mais comum para chefs qualificados \u00e9 o Critical Skills Employment Permit (sal\u00e1rio \u2265 \u20ac32.000/ano).',
    ih_visa_br:         'Cidad\u00e3os Brasileiros',
    ih_visa_br_text:    'A Irlanda e o Brasil t\u00eam um Acordo de F\u00e9rias e Trabalho. Brasileiros de 18 a 35 anos podem solicitar um visto de f\u00e9rias e trabalho de 1 ano.',
    ih_visa_link:       'Verificar requisitos de visto no DEASP \u2192',
  },

  es: {
    nav_jobs:           'Empleos',
    nav_infohub:        'Info Hub',
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

    // ---- Info Hub ----
    ih_hero_title:      'Tu Hub de Carrera Chef en Dubl\u00edn',
    ih_hero_sub:        'Noticias del sector, consejos de carrera y recursos esenciales \u2014 todo lo que un chef necesita para prosperar en Dubl\u00edn.',
    ih_news_title:      'Noticias del Sector',
    ih_news_sub:        '\u00daltimas noticias de la escena de hosteler\u00eda y gastronom\u00eda irlandesa',
    ih_news_read:       'Leer Art\u00edculo',
    ih_news_empty:      'No hay noticias disponibles ahora. Vuelve pronto.',
    ih_news_error:      'No se pudieron cargar las noticias.',
    ih_articles_title:  'Consejos & Historias de Chefs',
    ih_articles_sub:    'Posts escritos por el equipo \u2014 consejos de carrera, vida en Dubl\u00edn, cultura de cocina',
    ih_articles_read:   'Leer Post',
    ih_articles_cta:    'Escribir en Dev.to \u2192',
    ih_articles_empty_title: 'A\u00fan no hay posts',
    ih_articles_empty_text:  'S\u00e9 el primero \u2014 escribe tu historia en Dev.to y aparecer\u00e1 aqu\u00ed autom\u00e1ticamente.',
    ih_min_read:        'min de lectura',
    ih_resources_title: 'Recursos en Dubl\u00edn',
    ih_resources_sub:   'Informaci\u00f3n pr\u00e1ctica para chefs que viven y trabajan en Dubl\u00edn',
    ih_salary_title:    'Gu\u00eda de Salarios',
    ih_salary_sub:      'Salarios anuales promedio para roles de chef en Dubl\u00edn (2025)',
    ih_salary_note:     'Cifras estimadas seg\u00fan datos del mercado. Los salarios reales var\u00edan seg\u00fan empleador y experiencia.',
    ih_pps_title:       'Gu\u00eda del N\u00famero PPS',
    ih_pps_sub:         'Necesitas un PPSN para trabajar legalmente en Irlanda',
    ih_pps_s1:          'Reserva una cita en tu Intreo Centre u oficina DSP m\u00e1s cercana',
    ih_pps_s2:          'Lleva tu pasaporte (o DNI para ciudadanos de la UE)',
    ih_pps_s3:          'Lleva comprobante de domicilio (factura de servicios, carta del banco, contrato de alquiler)',
    ih_pps_s4:          'Lleva comprobante de por qu\u00e9 necesitas el PPSN (carta de oferta de empleo)',
    ih_pps_s5:          'El procesamiento tarda entre 1 y 5 d\u00edas h\u00e1biles',
    ih_pps_link:        'Encontrar el Intreo Centre m\u00e1s cercano \u2192',
    ih_col_title:       'Costo de Vida',
    ih_col_sub:         'Estimaciones mensuales para una persona en Dubl\u00edn',
    ih_col_room:        'Habitaci\u00f3n (piso compartido)',
    ih_col_studio:      'Apartamento estudio',
    ih_col_transport:   'Transporte mensual (Tarjeta Leap)',
    ih_col_groceries:   'Alimentaci\u00f3n (supermercado)',
    ih_col_eating_out:  'Comer fuera (econ\u00f3mico)',
    ih_col_note:        'Dubl\u00edn es una de las ciudades m\u00e1s caras de la UE. Se recomienda encarecidamente el alojamiento compartido al comenzar.',
    ih_visa_title:      'Trabajar en Irlanda',
    ih_visa_eu:         'Ciudadanos UE / EEE',
    ih_visa_eu_text:    'No se necesita visado. Tienes derecho a vivir y trabajar libremente en Irlanda.',
    ih_visa_noneu:      'Ciudadanos no comunitarios',
    ih_visa_noneu_text: 'Se requiere permiso de trabajo. El m\u00e1s com\u00fan para chefs cualificados es el Critical Skills Employment Permit (salario \u2265 \u20ac32.000/a\u00f1o).',
    ih_visa_br:         'Ciudadanos Brasileños',
    ih_visa_br_text:    'Irlanda y Brasil tienen un Acuerdo de Vacaciones y Trabajo. Los brasileños de 18 a 35 años pueden solicitar un visado de vacaciones y trabajo de 1 año.',
    ih_visa_link:       'Consultar requisitos de visado en DEASP \u2192',
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
