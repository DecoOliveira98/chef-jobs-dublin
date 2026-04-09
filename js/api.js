// ============================================================
// api.js — Chef Jobs Dublin (frontend)
// Calls the Vercel backend at /api/jobs.
// All API keys live server-side — none exposed here.
// ============================================================

async function fetchAllJobs(query) {
  const params = new URLSearchParams({ query: query || 'chef' });
  const res = await fetch('/api/jobs?' + params.toString());
  if (!res.ok) throw new Error('Jobs API ' + res.status);
  const data = await res.json();
  return data.jobs || [];
}
