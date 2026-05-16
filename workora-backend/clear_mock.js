require('dotenv').config();
const { Pool } = require('pg');

const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;

const pool = new Pool({
  connectionString: cleanEnv(process.env.DATABASE_URL),
  ssl: { rejectUnauthorized: false }
});

async function clearMockData() {
  const client = await pool.connect();
  try {
    console.log('--- RESETTING WORKORA TO LIVE MODE ---');
    
    // Clear dynamic content
    await client.query('TRUNCATE TABLE gig_comments CASCADE');
    await client.query('TRUNCATE TABLE gig_likes CASCADE');
    await client.query('TRUNCATE TABLE gigs CASCADE');
    await client.query('TRUNCATE TABLE ratings CASCADE');
    await client.query('TRUNCATE TABLE messages CASCADE');
    await client.query('TRUNCATE TABLE conversations CASCADE');
    
    console.log('SUCCESS: All dummy posts, comments, and messages removed.');
    console.log('The platform is now fresh for live content.');
  } catch (err) {
    console.error('ERROR during reset:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

clearMockData();
