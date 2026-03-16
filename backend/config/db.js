const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection without database specified to create the DB first
const initDb = async () => {
  let tempConnection;
  try {
    tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    const dbName = process.env.DB_NAME || 'gymflow';
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' checked/created.`);
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    if (tempConnection) await tempConnection.end();
  }
};

// Create the actual pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gymflow',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create tables
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS foods_cache (
        fdcId INT PRIMARY KEY,
        description VARCHAR(255),
        calories FLOAT,
        protein FLOAT,
        carbs FLOAT,
        fat FLOAT
      )
    `);
    console.log('Database initialized: foods_cache table is ready.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized: users table is ready.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_foods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        fdcId INT NOT NULL,
        title VARCHAR(255),
        portion VARCHAR(50),
        category VARCHAR(50),
        calories INT,
        protein INT,
        carbs INT,
        fat INT,
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Database initialized: user_foods table is ready.');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

// Run initialization sequentially
(async () => {
  await initDb();
  await createTables();
})();

module.exports = pool;
