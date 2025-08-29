
# Technoid – Full‑Stack Portfolio (Node/Express + SQLite)

This is a professional, production‑ready portfolio scaffold — front‑end wired to a working back‑end.

## What’s included
- Modern responsive UI (HTML/CSS/JS), with placeholder **logo**, **images**, and a **video** you can replace later.
- Node/Express API (`/api/projects`, `/api/contact`, `/api/subscribe`) backed by **SQLite**.
- Static serving + SPA fallback — one command to run everything locally.
- Clean file structure for easy customization and deployment.

## Quick start
```bash
# 1) Install dependencies
npm install

# 2) Initialize the local SQLite database (creates backend/data.sqlite)
npm run initdb

# 3) Start the server (serves front‑end + APIs)
npm start
# Now open http://localhost:8080
```

## Replace placeholders
- Logo: `assets/logo/logo.png`
- Gallery images: `assets/img/gallery_*.png`
- Hero video: edit `<video>` src in `index.html` (or place your own file in `assets/video/` and point to it).

## Where data goes
- Contact submissions → `backend/data.sqlite` → table: `messages`
- Newsletter signups → table: `subscribers`
- Projects displayed on homepage → table: `projects` (seeded with demo rows).

## Deploy
You can deploy to Render, Railway, Fly.io, or a VPS. The app serves static files and APIs from one Node process.
On Render/Railway: set the _Start Command_ to `npm start`. Ensure you run `npm run initdb` on first deploy (as a job).

## Customize
- Update site copy and sections in `index.html`
- Add styles in `css/style.css`
- Front‑end logic in `js/app.js`
- API routes in `backend/server.js`
- DB schema/seed in `backend/init-db.js`

---

Generated: 2025-08-25T05:38:56.605763Z
