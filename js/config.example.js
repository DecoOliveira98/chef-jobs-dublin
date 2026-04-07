// config.example.js — Chef Jobs Dublin
// ---------------------------------------------------------------
// This file IS committed to version control as a reference.
// Copy it to config.js and fill in your real keys (from .env).
//
//   cp js/config.example.js js/config.js
//
// config.js is gitignored — your real keys will stay private.
// ---------------------------------------------------------------

const CONFIG = {
  adzuna: {
    appId:  'YOUR_ADZUNA_APP_ID',   // from .env: ADZUNA_APP_ID
    appKey: 'YOUR_ADZUNA_APP_KEY',  // from .env: ADZUNA_APP_KEY
  },
  jsearch: {
    rapidApiKey: 'YOUR_RAPIDAPI_KEY', // from .env: RAPIDAPI_KEY
  },
};
