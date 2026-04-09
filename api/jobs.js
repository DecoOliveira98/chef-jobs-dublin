// ============================================================
// api/jobs.js — Vercel Serverless Function
// Aggregates chef jobs from Adzuna + Indeed + JSearch.
// All API keys read from Vercel environment variables.
// Frontend calls: GET /api/jobs?query=chef
// ============================================================

const ADZUNA_BASE  = 'https://api.adzuna.com/v1/api/jobs/gb/search';
const INDEED_BASE  = 'https://indeed12.p.rapidapi.com/jobs/search';
const JSEARCH_BASE = 'https://jsearch.p.rapidapi.com/search';
const RESULTS_PER_PAGE = 20;

// ── Salary formatter ─────────────────────────────────────────
function buildSalaryLabel(min, max, isPredicted) {
  if (!min && !max) return null;
  const fmt = n => Math.round(n).toLocaleString('en-IE') + ' p/yr';
  let label = min && max ? `${fmt(min)} – ${fmt(max)}`
    : min ? `From ${fmt(min)}`
    : `Up to ${fmt(max)}`;
  return isPredicted ? label + ' (est.)' : label;
}

// ── Normalisers ───────────────────────────────────────────────
function normaliseAdzuna(raw) {
  return {
    id:          `adzuna-${raw.id}`,
    title:       raw.title || 'Chef',
    company:     raw.company?.display_name || 'Company not listed',
    salaryLabel: buildSalaryLabel(raw.salary_min, raw.salary_max, raw.salary_is_predicted),
    location:    'Dublin, Ireland',
    applyUrl:    raw.redirect_url || '#',
    postedAt:    raw.created || null,
    source:      'adzuna',
  };
}

function normaliseIndeed(raw) {
  return {
    id:          `indeed-${raw.id || Math.random()}`,
    title:       raw.title        || 'Chef',
    company:     raw.company_name || 'Company not listed',
    salaryLabel: raw.salary       || null,
    location:    raw.location     || 'Dublin, Ireland',
    applyUrl:    raw.url          || '#',
    postedAt:    raw.date         || null,
    source:      'indeed',
  };
}

function normaliseJSearch(raw) {
  const city = raw.job_city || '';
  return {
    id:          `jsearch-${raw.job_id}`,
    title:       raw.job_title     || 'Chef',
    company:     raw.employer_name || 'Company not listed',
    salaryLabel: buildSalaryLabel(raw.job_min_salary, raw.job_max_salary, false),
    location:    city ? `${city}, ${raw.job_country || 'IE'}` : 'Dublin, IE',
    applyUrl:    raw.job_apply_link || '#',
    postedAt:    raw.job_posted_at_datetime_utc || null,
    source:      'jsearch',
  };
}

// ── Deduplication ─────────────────────────────────────────────
function deduplicateJobs(jobs) {
  const seen = new Set();
  return jobs.filter(job => {
    const key = `${job.title.toLowerCase().trim()}|${job.company.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Fetchers ──────────────────────────────────────────────────
async function fetchAdzuna(query) {
  const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return [];

  const keyword = `${query} dublin`.trim();
  const params = new URLSearchParams({
    app_id: ADZUNA_APP_ID, app_key: ADZUNA_APP_KEY,
    what: keyword, results_per_page: RESULTS_PER_PAGE, sort_by: 'date',
  });
  const res = await fetch(`${ADZUNA_BASE}/1?${params}`);
  if (!res.ok) throw new Error(`Adzuna ${res.status}`);
  const data = await res.json();
  return (data.results || []).map(normaliseAdzuna);
}

async function fetchIndeed(query) {
  const { RAPIDAPI_KEY } = process.env;
  if (!RAPIDAPI_KEY) return [];

  const params = new URLSearchParams({
    query: `${query} Dublin`, location: 'Dublin, Ireland', locality: 'ie', start: '0',
  });
  const res = await fetch(`${INDEED_BASE}?${params}`, {
    headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'indeed12.p.rapidapi.com' },
  });
  if (res.status === 403 || res.status === 401) {
    console.warn('Indeed: not subscribed on RapidAPI');
    return [];
  }
  if (!res.ok) throw new Error(`Indeed ${res.status}`);
  const data = await res.json();
  return (data.hits || []).map(normaliseIndeed);
}

async function fetchJSearch(query) {
  const { RAPIDAPI_KEY } = process.env;
  if (!RAPIDAPI_KEY) return [];

  const params = new URLSearchParams({ query: `${query} Dublin Ireland`, page: '1', num_pages: '1' });
  const res = await fetch(`${JSEARCH_BASE}?${params}`, {
    headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
  });
  if (!res.ok) throw new Error(`JSearch ${res.status}`);
  const data = await res.json();
  return (data.data || []).map(normaliseJSearch);
}

// ── Handler ───────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const query = req.query.query || 'chef';

  const results = await Promise.allSettled([
    fetchAdzuna(query),
    fetchIndeed(query),
    fetchJSearch(query),
  ]);

  const sources = ['adzuna', 'indeed', 'jsearch'];
  const allJobs = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') allJobs.push(...r.value);
    else console.warn(`${sources[i]} failed:`, r.reason?.message);
  });

  const jobs = deduplicateJobs(allJobs);
  res.status(200).json({ jobs, count: jobs.length });
};
