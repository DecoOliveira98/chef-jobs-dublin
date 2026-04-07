// ============================================================
// app.js — Chef Jobs Dublin
// UI state, rendering, filters, and event listeners.
// Depends on: config.js, i18n.js, api.js (must be loaded before this)
// ============================================================

// key = English term used for substring filtering on job titles (always English)
// i18nKey = translation key for the display label
const CHEF_LEVELS = [
  { key: 'all levels',      i18nKey: 'level_all'    },
  { key: 'commis chef',     i18nKey: 'level_commis' },
  { key: 'chef de partie',  i18nKey: 'level_cdp'    },
  { key: 'sous chef',       i18nKey: 'level_sous'   },
  { key: 'head chef',       i18nKey: 'level_head'   },
  { key: 'executive chef',  i18nKey: 'level_exec'   },
  { key: 'pastry chef',     i18nKey: 'level_pastry' },
  { key: 'kitchen porter',  i18nKey: 'level_porter' },
];

const SKELETON_COUNT = 8;

// ------------------------------------------------------------
// Reactive state
// ------------------------------------------------------------
const state = {
  allJobs:      [],
  filteredJobs: [],
  activeLevel:  'all levels',
  activeSource: 'all',
  searchQuery:  '',
  isLoading:    true,
  hasError:     false,
};

// ------------------------------------------------------------
// Skeleton loader
// ------------------------------------------------------------
function showSkeletons() {
  const grid = document.getElementById('jobsGrid');
  grid.innerHTML = '';
  for (let i = 0; i < SKELETON_COUNT; i++) {
    const card = document.createElement('article');
    card.className = 'job-card job-card--skeleton';
    // innerHTML is safe here — no API or user data involved
    card.innerHTML =
      '<div class="skeleton-line skeleton-line--short"></div>' +
      '<div class="skeleton-line skeleton-line--medium" style="margin-top:.75rem"></div>' +
      '<div class="skeleton-line skeleton-line--short" style="margin-top:.5rem"></div>' +
      '<div class="skeleton-line" style="margin-top:1.25rem;height:2.25rem;border-radius:8px"></div>';
    grid.appendChild(card);
  }
}

// ------------------------------------------------------------
// Job card builder (XSS-safe: API strings via textContent only)
// ------------------------------------------------------------
function createJobCard(job) {
  const card = document.createElement('article');
  card.className = 'job-card';

  // ---- Header row: source badge ----
  const header = document.createElement('div');
  header.className = 'job-card__header';

  const badge = document.createElement('span');
  badge.className = 'job-card__source-badge job-card__source-badge--' + job.source;
  const sourceLabels = { adzuna: 'Adzuna', indeed: 'Indeed', jsearch: 'JSearch' };
  badge.textContent = sourceLabels[job.source] || job.source;
  header.appendChild(badge);

  if (job.postedAt) {
    const dateSpan = document.createElement('span');
    dateSpan.className = 'job-card__date';
    dateSpan.textContent = formatDate(job.postedAt);
    header.appendChild(dateSpan);
  }

  // ---- Title ----
  const title = document.createElement('h2');
  title.className = 'job-card__title';
  title.textContent = job.title;

  // ---- Company ----
  const company = document.createElement('p');
  company.className = 'job-card__company';
  company.textContent = job.company;

  // ---- Meta: location + salary ----
  const meta = document.createElement('div');
  meta.className = 'job-card__meta';

  const loc = document.createElement('span');
  loc.className = 'job-card__location';
  const locIcon = document.createElement('span');
  locIcon.setAttribute('aria-hidden', 'true');
  locIcon.textContent = '\uD83D\uDCCD ';
  loc.appendChild(locIcon);
  loc.appendChild(document.createTextNode(job.location));

  const sal = document.createElement('span');
  sal.className = 'job-card__salary' + (job.salaryLabel ? '' : ' job-card__salary--unknown');
  const salIcon = document.createElement('span');
  salIcon.setAttribute('aria-hidden', 'true');
  salIcon.textContent = '\uD83D\uDCB0 ';
  sal.appendChild(salIcon);
  sal.appendChild(document.createTextNode(job.salaryLabel || t('salary_unknown')));

  meta.appendChild(loc);
  meta.appendChild(sal);

  // ---- Footer: apply button ----
  const footer = document.createElement('div');
  footer.className = 'job-card__footer';

  const applyBtn = document.createElement('a');
  applyBtn.className = 'btn btn--primary job-card__apply-btn';
  applyBtn.href = job.applyUrl;
  applyBtn.target = '_blank';
  applyBtn.rel = 'noopener noreferrer';
  applyBtn.textContent = t('apply_btn');

  footer.appendChild(applyBtn);

  card.appendChild(header);
  card.appendChild(title);
  card.appendChild(company);
  card.appendChild(meta);
  card.appendChild(footer);

  return card;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return t('date_today');
    if (diffDays === 1) return t('date_yesterday');
    if (diffDays < 7)  return t('date_days',  { n: diffDays });
    if (diffDays < 30) return t('date_weeks', { n: Math.floor(diffDays / 7) });
    return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
  } catch (e) {
    return '';
  }
}

// ------------------------------------------------------------
// Client-side filtering
// ------------------------------------------------------------
function applyFilters(jobs) {
  return jobs.filter(function(job) {
    // Source filter
    if (state.activeSource !== 'all' && job.source !== state.activeSource) return false;

    // Chef level filter — substring match on job title
    if (state.activeLevel !== 'all levels') {
      if (job.title.toLowerCase().indexOf(state.activeLevel.toLowerCase()) === -1) return false;
    }

    // Search query — matches title or company
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const inTitle   = job.title.toLowerCase().indexOf(q)   !== -1;
      const inCompany = job.company.toLowerCase().indexOf(q) !== -1;
      if (!inTitle && !inCompany) return false;
    }

    return true;
  });
}

// ------------------------------------------------------------
// Render
// ------------------------------------------------------------
function render() {
  const grid       = document.getElementById('jobsGrid');
  const emptyState = document.getElementById('emptyState');
  const jobsCount  = document.getElementById('jobsCount');
  const errorBanner = document.getElementById('errorBanner');

  if (state.isLoading) {
    showSkeletons();
    emptyState.classList.add('hidden');
    if (errorBanner) errorBanner.classList.add('hidden');
    return;
  }

  grid.innerHTML = '';

  if (state.hasError && state.allJobs.length === 0) {
    if (errorBanner) errorBanner.classList.remove('hidden');
    jobsCount.textContent = '';
    return;
  }

  if (errorBanner) errorBanner.classList.add('hidden');

  if (state.filteredJobs.length === 0) {
    emptyState.classList.remove('hidden');
    jobsCount.textContent = '';
    return;
  }

  emptyState.classList.add('hidden');
  const count = state.filteredJobs.length;
  jobsCount.textContent = tCount(count);

  state.filteredJobs.forEach(function(job) {
    grid.appendChild(createJobCard(job));
  });
}

// ------------------------------------------------------------
// Chip builders
// ------------------------------------------------------------
function renderLevelChips() {
  const container = document.getElementById('levelChips');
  container.innerHTML = '';
  CHEF_LEVELS.forEach(function(level, idx) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (state.activeLevel === level.key ? ' chip--active' : '');
    btn.dataset.level = level.key;
    btn.textContent = t(level.i18nKey);
    container.appendChild(btn);
  });
}

// ------------------------------------------------------------
// Event listeners
// ------------------------------------------------------------
function attachEventListeners() {
  // Level chips
  document.getElementById('levelChips').addEventListener('click', function(e) {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#levelChips .chip').forEach(function(c) {
      c.classList.remove('chip--active');
    });
    btn.classList.add('chip--active');
    state.activeLevel    = btn.dataset.level;
    state.filteredJobs   = applyFilters(state.allJobs);
    render();
  });

  // Search form
  document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    state.searchQuery = document.getElementById('searchInput').value.trim();
    // Apply local filter first for instant feedback, then re-fetch with new keyword
    state.filteredJobs = applyFilters(state.allJobs);
    render();
    loadJobs();
  });

  // Hero search also triggers on the same form
}

// ------------------------------------------------------------
// Data loading
// ------------------------------------------------------------
async function loadJobs() {
  state.isLoading = true;
  state.hasError  = false;
  render(); // show skeletons immediately

  try {
    const query = state.searchQuery || 'chef';
    state.allJobs      = await fetchAllJobs(query);
    state.filteredJobs = applyFilters(state.allJobs);
  } catch (err) {
    state.hasError = true;
    console.error('loadJobs error:', err);
  } finally {
    state.isLoading = false;
    render();
  }
}

// ------------------------------------------------------------
// Init
// ------------------------------------------------------------
async function init() {
  renderLevelChips();
  attachEventListeners();
  await loadJobs();
}

document.addEventListener('DOMContentLoaded', init);
