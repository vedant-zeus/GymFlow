const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection without database specified to create the DB first
const initDb = async () => {
  let tempConnection;
  try {
    tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined
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
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS personal_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        exercise_id VARCHAR(50) NOT NULL,
        exercise_name VARCHAR(255) NOT NULL,
        weight FLOAT NOT NULL,
        unit VARCHAR(10) DEFAULT 'KG',
        notes TEXT,
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Database initialized: personal_records table is ready.');
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
