const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkData() {
  try {
    const gigs = await pool.query('SELECT COUNT(*) FROM gigs');
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const workers = await pool.query('SELECT COUNT(*) FROM worker_profiles');
    
    console.log('=== DATABASE STATUS ===');
    console.log('Total gigs:', gigs.rows[0].count);
    console.log('Total users:', users.rows[0].count);
    console.log('Total workers:', workers.rows[0].count);
    
    // Check if backend is returning data
    const feedQuery = await pool.query(`
      SELECT 
        g.*, 
        COALESCE(p.full_name, u.username) as user_name, 
        u.username as handle, 
        COALESCE(p.trade, 'Member') as trade
      FROM gigs g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN worker_profiles p ON u.id = p.user_id
      ORDER BY g.created_at DESC
      LIMIT 5
    `);
    
    console.log('\nSample feed data (5 posts):');
    feedQuery.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. ${row.user_name} - ${row.trade}`);
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkData();
