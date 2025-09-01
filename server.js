import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "christopher";

// ----------------- Database -----------------
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined, // for Railway Private DB
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// ----------------- Middleware -----------------
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// ----------------- API Routes -----------------
// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "technoid-backend" });
});

// Contact form
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message)
      return res.status(400).json({ error: "Name, email, and message are required." });

    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name.trim(), email.trim(), message.trim()]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error saving message." });
  }
});

// Admin view
app.get("/api/contacts", async (req, res) => {
  try {
    const { key } = req.query;
    if ((key || "") !== ADMIN_PASSWORD)
      return res.status(401).json({ error: "Unauthorized" });

    const { rows } = await pool.query(
      "SELECT id, name, email, message, created_at FROM messages ORDER BY id DESC"
    );

    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// ----------------- Serve Frontend -----------------
const docsPath = path.resolve(__dirname, "docs");

app.use(express.static(docsPath));

// Fallback for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(docsPath, "index.html"));
});

// ----------------- Start Server -----------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Technoid fullstack running on port ${PORT}`);
});