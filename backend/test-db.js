import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function testDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to MySQL!');

    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('Test query result:', rows);

    await connection.end();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

testDB();

