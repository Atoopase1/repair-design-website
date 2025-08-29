import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'christopher';

// MySQL Pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'christopher',
  database: process.env.DB_NAME || 'repair_website',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'technoid-backend' });
});

// Contact form
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) 
      return res.status(400).json({ error: 'Name, email, and message are required.' });

    await pool.query(
      'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', 
      [name.trim(), email.trim(), message.trim()]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving message.' });
  }
});

// Admin view
app.get('/api/contacts', async (req, res) => {
  try {
    const { key } = req.query;
    if ((key || '') !== ADMIN_PASSWORD) 
      return res.status(401).json({ error: 'Unauthorized' });

    const [rows] = await pool.query(
      'SELECT id, name, email, message, created_at FROM messages ORDER BY id DESC'
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Technoid backend on http://localhost:${PORT}`);
});
