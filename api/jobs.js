// ============================================================
// api/jobs.js — Vercel Serverless Function
// Aggregates chef jobs from Adzuna + Reed.co.uk + JSearch.
// All API keys read from Vercel environment variables.
// Frontend calls: GET /api/jobs?query=chef
// ============================================================

const ADZUNA_BASE  = 'https://api.adzuna.com/v1/api/jobs/gb/search';
const REED_BASE    = 'https://www.reed.co.uk/api/1.0/search';
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

function normaliseReed(raw) {
  return {
    id:          `reed-${raw.jobId}`,
    title:       raw.jobTitle      || 'Chef',
    company:     raw.employerName  || 'Company not listed',
    salaryLabel: buildSalaryLabel(raw.minimumSalary, raw.maximumSalary, false),
    location:    raw.locationName  || 'Dublin, Ireland',
    applyUrl:    raw.jobUrl        || '#',
    postedAt:    raw.date          || null,
    source:      'reed',
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

async function fetchReed(query) {
  const { REED_API_KEY } = process.env;
  if (!REED_API_KEY) return [];

  const params = new URLSearchParams({
    keywords:        `${query}`,
    locationName:    'Dublin',
    distancefromlocation: '10',
    resultsToTake:   RESULTS_PER_PAGE,
    resultsToSkip:   0,
  });

  // Reed uses HTTP Basic Auth: API key as username, empty password
  const credentials = Buffer.from(`${REED_API_KEY}:`).toString('base64');

  const res = await fetch(`${REED_BASE}?${params}`, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type':  'application/json',
    },
  });
  if (!res.ok) throw new Error(`Reed ${res.status}`);
  const data = await res.json();
  return (data.results || []).map(normaliseReed);
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
    fetchReed(query),
    fetchJSearch(query),
  ]);

  const sources = ['adzuna', 'reed', 'jsearch'];
  const allJobs = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') allJobs.push(...r.value);
    else console.warn(`${sources[i]} failed:`, r.reason?.message);
  });

  const jobs = deduplicateJobs(allJobs);
  res.status(200).json({ jobs, count: jobs.length });
};
