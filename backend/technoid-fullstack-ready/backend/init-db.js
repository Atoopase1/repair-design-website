
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const run = async () => {
  const db = await open({
    filename: path.join(projectRoot, 'backend', 'data.sqlite'),
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      summary TEXT,
      url TEXT,
      thumbnail TEXT
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  // seed some demo projects
  const countRow = await db.get('SELECT COUNT(*) as c FROM projects');
  if (countRow.c === 0) {
    const demo = [
      { title: 'SaaS Landing', category: 'Landing', summary: 'Conversion-focused landing page with A/B test hooks', url: '#', thumbnail: 'assets/img/gallery_2.png' },
      { title: 'E‑Commerce UI', category: 'Shop', summary: 'High‑performance storefront with cart & checkout', url: '#', thumbnail: 'assets/img/gallery_3.png' },
      { title: 'Portfolio 3D', category: 'Portfolio', summary: 'WebGL hero and smooth page transitions', url: '#', thumbnail: 'assets/img/gallery_4.png' }
    ];
    for (const p of demo) {
      await db.run('INSERT INTO projects (title, category, summary, url, thumbnail) VALUES (?, ?, ?, ?, ?)', [p.title, p.category, p.summary, p.url, p.thumbnail]);
    }
  }
  await db.close();
  console.log('Database initialized/seeded.');
};

run();
