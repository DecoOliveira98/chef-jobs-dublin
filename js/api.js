// ============================================================
// api.js — Chef Jobs Dublin
// Sources: Adzuna (direct) + Indeed via RapidAPI (indeed12) + JSearch
// Depends on: config.js (must be loaded first)
// ============================================================

// Adzuna does not have an 'ie' endpoint — the 'gb' endpoint covers
// British Isles jobs. Dublin jobs are retrieved by including "dublin"
// in the keyword query (what=chef+dublin) rather than using &where=.
const ADZUNA_BASE  = 'https://api.adzuna.com/v1/api/jobs/gb/search';
const INDEED_BASE  = 'https://indeed12.p.rapidapi.com/jobs/search';
const JSEARCH_BASE = 'https://jsearch.p.rapidapi.com/search';
const RESULTS_PER_PAGE = 20;

// ------------------------------------------------------------
// Shared salary formatter
// Adzuna GB endpoint returns numeric salary values without explicit
// currency — Dublin IE jobs may be EUR or GBP; we display raw numbers.
// ------------------------------------------------------------
function buildSalaryLabel(min, max, isPredicted) {
  if (!min && !max) return null;
  const fmt = n => Math.round(n).toLocaleString('en-IE') + ' p/yr';
  let label = '';
  if (min && max)  label = `${fmt(min)} \u2013 ${fmt(max)}`;
  else if (min)    label = `From ${fmt(min)}`;
  else             label = `Up to ${fmt(max)}`;
  if (isPredicted) label += ' (est.)';
  return label;
}

// ------------------------------------------------------------
// Adzuna
// ------------------------------------------------------------
function normaliseAdzuna(raw) {
  return {
    id:          'adzuna-' + raw.id,
    title:       raw.title || 'Chef',
    company:     (raw.company && raw.company.display_name) || 'Company not listed',
    salaryMin:   raw.salary_min  || null,
    salaryMax:   raw.salary_max  || null,
    salaryLabel: buildSalaryLabel(raw.salary_min, raw.salary_max, raw.salary_is_predicted),
    location:    'Dublin, Ireland',
    applyUrl:    raw.redirect_url || '#',
    description: raw.description  || '',
    postedAt:    raw.created      || null,
    source:      'adzuna',
  };
}

async function fetchAdzunaJobs(query) {
  // Always append "dublin" to target Dublin, Ireland jobs via the GB endpoint
  const keyword = ((query || 'chef') + ' dublin').trim();

  if (
    !CONFIG.adzuna.appId  || CONFIG.adzuna.appId.startsWith('YOUR_') ||
    !CONFIG.adzuna.appKey || CONFIG.adzuna.appKey.startsWith('YOUR_')
  ) {
    console.warn('Adzuna: API keys not configured in config.js — skipping fetch.');
    return [];
  }

  const params = new URLSearchParams({
    app_id:           CONFIG.adzuna.appId,
    app_key:          CONFIG.adzuna.appKey,
    what:             keyword,
    results_per_page: RESULTS_PER_PAGE,
    sort_by:          'date',
  });

  const res  = await fetch(ADZUNA_BASE + '/1?' + params.toString());
  if (!res.ok) throw new Error('Adzuna ' + res.status + ': ' + res.statusText);
  const data = await res.json();
  return (data.results || []).map(normaliseAdzuna);
}

// ------------------------------------------------------------
// Indeed (via indeed12 on RapidAPI)
// Subscribe free at: https://rapidapi.com/jaypat87/api/indeed12
// Uses the same rapidApiKey from CONFIG.jsearch
// ------------------------------------------------------------
function normaliseIndeed(raw) {
  const salaryText = raw.salary || '';
  return {
    id:          'indeed-' + (raw.id || Math.random()),
    title:       raw.title        || 'Chef',
    company:     raw.company_name || 'Company not listed',
    salaryMin:   null,
    salaryMax:   null,
    salaryLabel: salaryText || null,
    location:    raw.location     || 'Dublin, Ireland',
    applyUrl:    raw.url          || '#',
    description: raw.description  || '',
    postedAt:    raw.date         || null,
    source:      'indeed',
  };
}

async function fetchIndeedJobs(query) {
  if (!CONFIG.jsearch.rapidApiKey || CONFIG.jsearch.rapidApiKey.startsWith('YOUR_')) {
    console.warn('Indeed: RapidAPI key not configured — skipping fetch.');
    return [];
  }

  const params = new URLSearchParams({
    query:    (query || 'chef') + ' Dublin',
    location: 'Dublin, Ireland',
    locality: 'ie',
    start:    '0',
  });

  const res = await fetch(INDEED_BASE + '?' + params.toString(), {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key':  CONFIG.jsearch.rapidApiKey,
      'X-RapidAPI-Host': 'indeed12.p.rapidapi.com',
    },
  });

  if (res.status === 403 || res.status === 401) {
    console.warn('Indeed: Not subscribed to indeed12 API on RapidAPI — go to https://rapidapi.com/jaypat87/api/indeed12 and subscribe (free).');
    return [];
  }
  if (!res.ok) throw new Error('Indeed ' + res.status + ': ' + res.statusText);
  const data = await res.json();
  return (data.hits || []).map(normaliseIndeed);
}

// ------------------------------------------------------------
// JSearch (RapidAPI) — aggregates from Google for Jobs
// ------------------------------------------------------------
function normaliseJSearch(raw) {
  const city    = raw.job_city    || '';
  const country = raw.job_country || 'IE';
  return {
    id:          'jsearch-' + raw.job_id,
    title:       raw.job_title      || 'Chef',
    company:     raw.employer_name  || 'Company not listed',
    salaryMin:   raw.job_min_salary || null,
    salaryMax:   raw.job_max_salary || null,
    salaryLabel: buildSalaryLabel(raw.job_min_salary, raw.job_max_salary, false),
    location:    city ? city + ', ' + country : 'Dublin, IE',
    applyUrl:    raw.job_apply_link || '#',
    description: raw.job_description || '',
    postedAt:    raw.job_posted_at_datetime_utc || null,
    source:      'jsearch',
  };
}

async function fetchJSearchJobs(query) {
  if (!CONFIG.jsearch.rapidApiKey || CONFIG.jsearch.rapidApiKey.startsWith('YOUR_')) {
    console.warn('JSearch: RapidAPI key not configured — skipping fetch.');
    return [];
  }

  const params = new URLSearchParams({
    query:     query || 'chef Dublin Ireland',
    page:      '1',
    num_pages: '1',
  });

  const res = await fetch(JSEARCH_BASE + '?' + params.toString(), {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key':  CONFIG.jsearch.rapidApiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  });
  if (!res.ok) throw new Error('JSearch ' + res.status + ': ' + res.statusText);
  const data = await res.json();
  return (data.data || []).map(normaliseJSearch);
}

// ------------------------------------------------------------
// Deduplication — title|company key, first occurrence wins
// ------------------------------------------------------------
function deduplicateJobs(jobs) {
  const seen = new Set();
  return jobs.filter(function(job) {
    const key = job.title.toLowerCase().trim() + '|' + job.company.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ------------------------------------------------------------
// Main aggregator — all three sources fire in parallel
// One failure never blocks the others (Promise.allSettled)
// ------------------------------------------------------------
async function fetchAllJobs(query) {
  const keyword = query || 'chef';

  const results = await Promise.allSettled([
    fetchAdzunaJobs(keyword),
    fetchIndeedJobs(keyword),
    fetchJSearchJobs(keyword + ' Dublin Ireland'),
  ]);

  const sources = ['Adzuna', 'Indeed', 'JSearch'];
  const allJobs = [];

  results.forEach(function(result, i) {
    if (result.status === 'fulfilled') {
      allJobs.push.apply(allJobs, result.value);
    } else {
      console.warn(sources[i] + ' fetch failed:', result.reason);
    }
  });

  return deduplicateJobs(allJobs);
}
