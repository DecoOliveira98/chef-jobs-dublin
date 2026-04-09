# 🍴 Chef Jobs Dublin

> Dublin's niche job board for chef careers — from Commis to Executive Chef.
> Live job listings aggregated from **Adzuna**, **Indeed** and **JSearch**, with a built-in **Info Hub** packed with resources for chefs living and working in Dublin.

**Live site:** https://decooliveira98.github.io/chef-jobs-dublin

---

## Features

| Feature | Description |
|---|---|
| 🔍 **Live Job Listings** | Aggregates chef roles in Dublin from 3 APIs in real time |
| 🎛️ **Chef Level Filters** | Filter by Commis, Chef de Partie, Sous Chef, Head Chef, Executive, Pastry, Kitchen Porter |
| 🔎 **Keyword Search** | Search by role, keyword or restaurant name |
| 📰 **Info Hub — Industry News** | Auto-fetched from Google News (Irish hospitality & culinary) |
| ✍️ **Info Hub — Chef Tips** | Your own Dev.to posts appear automatically when published |
| 💰 **Salary Guide** | Visual salary bars for every chef level in Dublin (2025 data) |
| 🏠 **Cost of Living** | Monthly expense estimates for Dublin |
| 📋 **PPS Number Guide** | Step-by-step guide to getting your PPSN |
| ✈️ **Visa Info** | Work permit info for EU, non-EU and Brazilian citizens |
| 🌍 **3 Languages** | English, Portuguese (Brazil), Spanish — preference saved in localStorage |

---

## Tech Stack

- **Vanilla HTML / CSS / JavaScript** — no framework, no build step
- **Adzuna API** — chef job listings (GB endpoint, Dublin-filtered)
- **Indeed via RapidAPI** (indeed12) — Indeed Ireland job listings
- **JSearch via RapidAPI** — aggregates from Google for Jobs
- **rss2json.com** — converts Google News RSS to JSON (CORS-friendly, no key needed)
- **Dev.to API** — fetches your published articles automatically
- **i18n system** — custom translation engine in `js/i18n.js`

---

## Project Structure

```
chef-jobs-dublin/
├── index.html              ← Jobs listing page
├── info-hub.html           ← Info Hub page
├── css/
│   └── style.css           ← All styles (design tokens, components, responsive)
├── js/
│   ├── config.js           ← API keys (GITIGNORED — never commit)
│   ├── config.example.js   ← Template for config.js
│   ├── i18n.js             ← Translation engine + EN/PT-BR/ES strings
│   ├── api.js              ← Adzuna + Indeed + JSearch fetch logic
│   ├── app.js              ← Jobs UI: state, filters, rendering
│   └── infohub.js          ← Info Hub: News + Dev.to + static resources
├── .env                    ← Your real keys (GITIGNORED — never commit)
├── .gitignore
└── README.md
```

---

## Running Locally

> **Important:** You must serve via an HTTP server — opening `index.html` directly from `file://` will block API calls due to browser CORS restrictions.

### Option A — VS Code Live Server
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option B — Python (no install needed)
```bash
cd path/to/chef-jobs-dublin
python -m http.server 8080
# Open http://localhost:8080
```

---

## API Keys Setup

1. Copy the example config:
   ```bash
   cp js/config.example.js js/config.js
   ```

2. Fill in `js/config.js` with your keys (also keep `.env` in sync for reference):

| Key | Where to get it | Free tier |
|---|---|---|
| `ADZUNA_APP_ID` + `ADZUNA_APP_KEY` | [developer.adzuna.com](https://developer.adzuna.com/) | 250 calls/month |
| `RAPIDAPI_KEY` | [rapidapi.com](https://rapidapi.com) — subscribe to **Indeed12** + **JSearch** | Free plans available |
| `NEWSAPI_KEY` | [newsapi.org/register](https://newsapi.org/register) | 100 calls/day |
| `DEVTO_USERNAME` | Your [dev.to](https://dev.to) username (no key needed) | Free |

---

## Publishing Your Own Posts (Info Hub)

The Info Hub **Chef Tips & Stories** section pulls your articles from Dev.to automatically.

1. Create an account at [dev.to](https://dev.to)
2. Set your username in `js/config.js`:
   ```js
   devto: { username: 'your-devto-username' }
   ```
3. Write and publish any article on Dev.to
4. It will appear on the Info Hub the next time the page loads — **no code changes needed**

---

## Deploying to Vercel (Recommended)

GitHub Pages works for the static UI but **API keys can't be hidden** client-side. Vercel lets you store keys as environment variables and proxy API calls server-side.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Add environment variables in Vercel dashboard:
# ADZUNA_APP_ID, ADZUNA_APP_KEY, RAPIDAPI_KEY, NEWSAPI_KEY, DEVTO_USERNAME
```

---

## Languages

The site supports **3 languages**, switchable via the flag buttons in the nav:

| Flag | Language | Code |
|---|---|---|
| 🇬🇧 | English | `en` |
| 🇧🇷 | Portuguese (Brazil) | `pt-BR` |
| 🇪🇸 | Spanish | `es` |

Language preference is saved in `localStorage` and persists across sessions.

To add a new language, add a new object to `TRANSLATIONS` in `js/i18n.js` and a new button in the nav.

---

## Roadmap

- [ ] Deploy to Vercel with serverless API proxy (hide keys)
- [ ] Job detail modal (full description before applying)
- [ ] Save / bookmark jobs (localStorage)
- [ ] Sort by date or salary
- [ ] Email job alerts (EmailJS or Resend)
- [ ] Dark mode

---

## Author

Built by **Andre Oliveira** · [github.com/DecoOliveira98](https://github.com/DecoOliveira98)
Portfolio project — Dublin, Ireland 🇮🇪
