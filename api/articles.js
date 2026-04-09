// ============================================================
// api/articles.js — Vercel Serverless Function
// Fetches Dev.to articles by username.
// Frontend calls: GET /api/articles
// ============================================================

const DEVTO_BASE = 'https://dev.to/api/articles';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const username = process.env.DEVTO_USERNAME;
  if (!username) {
    return res.status(200).json({ articles: [], count: 0 });
  }

  const params = new URLSearchParams({ username, per_page: '6', state: 'fresh' });
  const devRes = await fetch(`${DEVTO_BASE}?${params}`, {
    headers: { 'Accept': 'application/vnd.forem.api-v1+json' },
  });

  if (!devRes.ok) {
    console.warn(`Dev.to ${devRes.status}`);
    return res.status(200).json({ articles: [], count: 0 });
  }

  const articles = await devRes.json();
  res.status(200).json({ articles, count: articles.length });
};
