const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.replace(/^["'](.+)["']$/, '$1'),
  ssl: { rejectUnauthorized: false }
});

async function getUsers() {
  try {
    const res = await pool.query('SELECT phone_number, username, role FROM users ORDER BY created_at DESC LIMIT 10');
    console.log('--- REGISTERED USERS (Latest 10) ---');
    console.table(res.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    await pool.end();
  }
}

getUsers();
