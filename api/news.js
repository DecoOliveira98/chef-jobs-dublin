// ============================================================
// api/news.js — Vercel Serverless Function
// Fetches Irish hospitality news via NewsAPI.
// Fallback: Google News RSS via rss2json (no key needed).
// Frontend calls: GET /api/news
// ============================================================

const NEWSAPI_BASE  = 'https://newsapi.org/v2/everything';
const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';
const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search?q=chef+ireland+restaurant+hospitality+dublin&hl=en-IE&gl=IE&ceid=IE:en';
const NEWS_COUNT = 9;

// ── NewsAPI ───────────────────────────────────────────────────
async function fetchFromNewsAPI(apiKey) {
  const params = new URLSearchParams({
    q:        'chef OR "head chef" OR "sous chef" OR hospitality OR restaurant',
    language: 'en',
    sortBy:   'publishedAt',
    pageSize:  NEWS_COUNT,
    apiKey,
  });
  const res = await fetch(`${NEWSAPI_BASE}?${params}`);
  if (!res.ok) throw new Error(`NewsAPI ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok') throw new Error(`NewsAPI: ${data.message}`);

  return (data.articles || []).map(a => ({
    title:     a.title,
    link:      a.url,
    thumbnail: a.urlToImage || null,
    author:    a.source?.name || 'News',
    pubDate:   a.publishedAt,
    description: a.description || '',
  }));
}

// ── rss2json fallback ─────────────────────────────────────────
async function fetchFromRSS() {
  const params = new URLSearchParams({ rss_url: GOOGLE_NEWS_RSS, count: NEWS_COUNT });
  const res = await fetch(`${RSS2JSON_BASE}?${params}`);
  if (!res.ok) throw new Error(`rss2json ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok') throw new Error(`rss2json: ${data.message}`);
  return data.items || [];
}

// ── Handler ───────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { NEWSAPI_KEY } = process.env;
  let items = [];

  if (NEWSAPI_KEY) {
    try {
      items = await fetchFromNewsAPI(NEWSAPI_KEY);
    } catch (err) {
      console.warn('NewsAPI failed, falling back to RSS:', err.message);
      items = await fetchFromRSS();
    }
  } else {
    items = await fetchFromRSS();
  }

  res.status(200).json({ items, count: items.length });
};
