import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

async function testDB() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to Postgres!');

    const res = await client.query('SELECT 1 + 1 AS result');
    console.log('Test query result:', res.rows);

    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

testDB();
