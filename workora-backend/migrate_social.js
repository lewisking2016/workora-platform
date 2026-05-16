require('dotenv').config();
const { Pool } = require('pg');

const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;

const pool = new Pool({
  connectionString: cleanEnv(process.env.DATABASE_URL),
  ssl: { rejectUnauthorized: false }
});

async function migrateGigsToSocial() {
  const client = await pool.connect();
  try {
    console.log('--- MIGRATING GIGS TO SOCIAL FEED ---');
    
    // Add user_id column if not exists
    await client.query('ALTER TABLE gigs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE');
    
    // If there's existing data (unlikely now), backfill user_id from worker_id
    await client.query(`
      UPDATE gigs g
      SET user_id = p.user_id
      FROM worker_profiles p
      WHERE g.worker_id = p.id AND g.user_id IS NULL
    `);
    
    // Make worker_id optional for social posts (Tips/Stories)
    await client.query('ALTER TABLE gigs ALTER COLUMN worker_id DROP NOT NULL');

    console.log('SUCCESS: Gigs table now supports all users (Personal & Business).');
  } catch (err) {
    console.error('ERROR during migration:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateGigsToSocial();
