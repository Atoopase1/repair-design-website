
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(projectRoot));

// SQLite
const dbPromise = open({
  filename: path.join(projectRoot, 'backend', 'data.sqlite'),
  driver: sqlite3.Database
});

// API routes
app.get('/api/health', async (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/api/projects', async (req, res) => {
  try {
    const db = await dbPromise;
    const rows = await db.all('SELECT id, title, category, summary, url, thumbnail FROM projects ORDER BY id DESC');
    res.json({ projects: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });
  try {
    const db = await dbPromise;
    await db.run('INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, datetime("now"))', [name, email, message]);
    res.json({ message: 'Thanks! I will get back to you shortly.' });
  } catch (e) {
    res.status(500).json({ message: 'Could not save message' });
  }
});

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    const db = await dbPromise;
    await db.run('INSERT INTO subscribers (email, created_at) VALUES (?, datetime("now"))', [email]);
    res.json({ message: 'Subscription confirmed!' });
  } catch (e) {
    if (e && e.message && e.message.includes('UNIQUE')) {
      return res.json({ message: 'You are already subscribed.' });
    }
    res.status(500).json({ message: 'Could not subscribe' });
  }
});

// SPA fallback (optional): serve index.html for unknown routes
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(projectRoot, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
