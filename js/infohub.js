// ============================================================
// infohub.js — Chef Jobs Dublin · Info Hub
// Fetches: Google News (via rss2json) + Dev.to articles
// Depends on: config.js, i18n.js
// ============================================================

// Google News RSS → JSON via rss2json (CORS-friendly, no key needed)
const NEWS_RSS_URL  = 'https://news.google.com/rss/search?q=chef+ireland+restaurant+hospitality+dublin&hl=en-IE&gl=IE&ceid=IE:en';
const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';
const DEVTO_BASE    = 'https://dev.to/api/articles';
const NEWS_COUNT    = 9;
const ARTICLES_COUNT = 6;

// ── Salary data (static, curated) ────────────────────────────
const SALARY_DATA = [
  { key: 'level_porter', min: 24000, max: 27000, color: '#6B7C3A' },
  { key: 'level_commis', min: 25000, max: 30000, color: '#E67E22' },
  { key: 'level_cdp',    min: 30000, max: 38000, color: '#E67E22' },
  { key: 'level_pastry', min: 30000, max: 45000, color: '#C0392B' },
  { key: 'level_sous',   min: 38000, max: 48000, color: '#C0392B' },
  { key: 'level_head',   min: 48000, max: 65000, color: '#8B1A1A' },
  { key: 'level_exec',   min: 65000, max: 95000, color: '#2C2C2C' },
];

const MAX_SALARY = 95000;

// ── Cost of living data ───────────────────────────────────────
const COL_DATA = [
  { key: 'ih_col_room',       value: '€800 – €1,400' },
  { key: 'ih_col_studio',     value: '€1,500 – €2,000' },
  { key: 'ih_col_transport',  value: '~€140' },
  { key: 'ih_col_groceries',  value: '€200 – €350' },
  { key: 'ih_col_eating_out', value: '€10 – €18 / meal' },
];

// ── Helpers ───────────────────────────────────────────────────
function fmtDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) { return ''; }
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function skeleton(count, cls) {
  const grid = document.getElementById(cls);
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'ih-card ih-card--skeleton';
    card.innerHTML =
      '<div class="ih-skeleton ih-skeleton--img"></div>' +
      '<div class="ih-skeleton" style="margin-top:1rem;width:60%"></div>' +
      '<div class="ih-skeleton" style="margin-top:.5rem"></div>' +
      '<div class="ih-skeleton" style="margin-top:.4rem;width:75%"></div>';
    grid.appendChild(card);
  }
}

// ── News (Google News RSS via rss2json) ───────────────────────
async function fetchNews() {
  const params = new URLSearchParams({
    rss_url: NEWS_RSS_URL,
    count:   NEWS_COUNT,
  });
  const res  = await fetch(RSS2JSON_BASE + '?' + params.toString());
  if (!res.ok) throw new Error('rss2json ' + res.status);
  const data = await res.json();
  if (data.status !== 'ok') throw new Error('rss2json error: ' + data.message);
  return data.items || [];
}

function renderNews(items) {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!items.length) {
    grid.innerHTML = '<p class="ih-empty" data-i18n="ih_news_empty">' + t('ih_news_empty') + '</p>';
    return;
  }

  items.forEach(function(item) {
    const card = document.createElement('article');
    card.className = 'ih-card';

    // Image
    const imgWrap = document.createElement('div');
    imgWrap.className = 'ih-card__img-wrap';
    if (item.thumbnail && item.thumbnail.startsWith('http')) {
      const img = document.createElement('img');
      img.src = item.thumbnail;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = function() { imgWrap.classList.add('ih-card__img-wrap--fallback'); };
      imgWrap.appendChild(img);
    } else {
      imgWrap.classList.add('ih-card__img-wrap--fallback');
    }

    // Source badge
    const source = document.createElement('span');
    source.className = 'ih-card__source';
    source.textContent = item.author || 'News';

    // Title
    const title = document.createElement('h3');
    title.className = 'ih-card__title';
    title.textContent = item.title;

    // Date
    const date = document.createElement('span');
    date.className = 'ih-card__date';
    date.textContent = fmtDate(item.pubDate);

    // Read link
    const link = document.createElement('a');
    link.className = 'ih-card__link';
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = t('ih_news_read') + ' \u2192';

    const meta = document.createElement('div');
    meta.className = 'ih-card__meta';
    meta.appendChild(source);
    meta.appendChild(date);

    card.appendChild(imgWrap);
    card.appendChild(meta);
    card.appendChild(title);
    card.appendChild(link);

    grid.appendChild(card);
  });
}

// ── Dev.to Articles ───────────────────────────────────────────
async function fetchArticles() {
  const username = CONFIG.devto && CONFIG.devto.username;
  if (!username || username.startsWith('YOUR_')) {
    console.warn('Dev.to: username not set in config.js — showing empty state.');
    return [];
  }

  const params = new URLSearchParams({
    username:  username,
    per_page:  ARTICLES_COUNT,
    state:     'fresh',
  });

  const res = await fetch(DEVTO_BASE + '?' + params.toString(), {
    headers: { 'Accept': 'application/vnd.forem.api-v1+json' },
  });
  if (!res.ok) throw new Error('Dev.to ' + res.status);
  return await res.json();
}

function renderArticles(articles) {
  const grid = document.getElementById('articlesGrid');
  const ctaBtn = document.getElementById('writeCta');
  if (!grid) return;
  grid.innerHTML = '';

  if (!articles.length) {
    const empty = document.createElement('div');
    empty.className = 'ih-empty-state';
    empty.innerHTML =
      '<span class="ih-empty-state__icon">\u270d\ufe0f</span>' +
      '<h3 class="ih-empty-state__title">' + t('ih_articles_empty_title') + '</h3>' +
      '<p class="ih-empty-state__text">' + t('ih_articles_empty_text') + '</p>';
    grid.appendChild(empty);
    return;
  }

  if (ctaBtn) ctaBtn.style.display = 'inline-flex';

  articles.forEach(function(article) {
    const card = document.createElement('article');
    card.className = 'ih-card ih-card--article';

    // Cover image
    const imgWrap = document.createElement('div');
    imgWrap.className = 'ih-card__img-wrap';
    if (article.cover_image) {
      const img = document.createElement('img');
      img.src = article.cover_image;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = function() { imgWrap.classList.add('ih-card__img-wrap--fallback'); };
      imgWrap.appendChild(img);
    } else {
      imgWrap.classList.add('ih-card__img-wrap--fallback');
    }

    // Tags
    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'ih-card__tags';
    (article.tag_list || []).slice(0, 3).forEach(function(tag) {
      const t_ = document.createElement('span');
      t_.className = 'ih-tag';
      t_.textContent = '#' + tag;
      tagsWrap.appendChild(t_);
    });

    // Title
    const title = document.createElement('h3');
    title.className = 'ih-card__title';
    title.textContent = article.title;

    // Description
    const desc = document.createElement('p');
    desc.className = 'ih-card__desc';
    desc.textContent = (article.description || '').slice(0, 120) + (article.description && article.description.length > 120 ? '…' : '');

    // Meta
    const meta = document.createElement('div');
    meta.className = 'ih-card__meta';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'ih-card__date';
    dateSpan.textContent = fmtDate(article.published_at);

    const readTime = document.createElement('span');
    readTime.className = 'ih-card__readtime';
    readTime.textContent = (article.reading_time_minutes || 1) + ' ' + t('ih_min_read');

    meta.appendChild(dateSpan);
    meta.appendChild(readTime);

    // Link
    const link = document.createElement('a');
    link.className = 'ih-card__link';
    link.href = article.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = t('ih_articles_read') + ' \u2192';

    card.appendChild(imgWrap);
    card.appendChild(tagsWrap);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    card.appendChild(link);

    grid.appendChild(card);
  });
}

// ── Salary Guide ──────────────────────────────────────────────
function renderSalaryGuide() {
  const container = document.getElementById('salaryGuide');
  if (!container) return;
  container.innerHTML = '';

  SALARY_DATA.forEach(function(row) {
    const item = document.createElement('div');
    item.className = 'salary-row';

    const label = document.createElement('span');
    label.className = 'salary-row__label';
    label.textContent = t(row.key);

    const barWrap = document.createElement('div');
    barWrap.className = 'salary-row__bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'salary-row__bar';
    const pct = Math.round((row.max / MAX_SALARY) * 100);
    bar.style.setProperty('--bar-pct', pct + '%');
    bar.style.setProperty('--bar-color', row.color);

    const range = document.createElement('span');
    range.className = 'salary-row__range';
    range.textContent = '\u20ac' + (row.min / 1000).toFixed(0) + 'k \u2013 \u20ac' + (row.max / 1000).toFixed(0) + 'k';

    barWrap.appendChild(bar);
    item.appendChild(label);
    item.appendChild(barWrap);
    item.appendChild(range);
    container.appendChild(item);
  });
}

// ── Cost of Living ────────────────────────────────────────────
function renderCostOfLiving() {
  const container = document.getElementById('colTable');
  if (!container) return;
  container.innerHTML = '';

  COL_DATA.forEach(function(row) {
    const item = document.createElement('div');
    item.className = 'col-row';

    const label = document.createElement('span');
    label.className = 'col-row__label';
    label.textContent = t(row.key);

    const value = document.createElement('span');
    value.className = 'col-row__value';
    value.textContent = row.value;

    item.appendChild(label);
    item.appendChild(value);
    container.appendChild(item);
  });
}

// ── Init ──────────────────────────────────────────────────────
async function initInfoHub() {
  // Render static sections immediately
  renderSalaryGuide();
  renderCostOfLiving();

  // Skeletons for async sections
  skeleton(NEWS_COUNT, 'newsGrid');
  skeleton(ARTICLES_COUNT, 'articlesGrid');

  // Fetch in parallel
  const [newsResult, articlesResult] = await Promise.allSettled([
    fetchNews(),
    fetchArticles(),
  ]);

  if (newsResult.status === 'fulfilled') {
    renderNews(newsResult.value);
  } else {
    console.warn('News fetch failed:', newsResult.reason);
    const grid = document.getElementById('newsGrid');
    if (grid) grid.innerHTML = '<p class="ih-empty">' + t('ih_news_error') + '</p>';
  }

  if (articlesResult.status === 'fulfilled') {
    renderArticles(articlesResult.value);
  } else {
    console.warn('Dev.to fetch failed:', articlesResult.reason);
    renderArticles([]);
  }
}

document.addEventListener('DOMContentLoaded', initInfoHub);
