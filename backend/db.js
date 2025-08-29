// backend/db.js
const mysql = require('mysql2');

// Create a connection
const db = mysql.createConnection({
  host: 'localhost',      // your MySQL host
  user: 'root',           // your MySQL username
  password: 'christopher',           // your MySQL password
  database: 'repair_website' // your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = db;
