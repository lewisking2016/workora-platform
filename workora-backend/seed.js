require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const TEST_WORKERS = [
  { name: 'James Kamau', phone: '0711222333', trade: 'Electrical', pass: 'james2026' },
  { name: 'Grace Wanjiku', phone: '0722333444', trade: 'Interior Design', pass: 'grace2026' },
  { name: 'Brian Kipchoge', phone: '0733444555', trade: 'Welding', pass: 'brian2026' },
  { name: 'Faith Akinyi', phone: '0744555666', trade: 'Catering', pass: 'faith2026' }
];

async function seed() {
  console.log('🌱 Seeding database with test accounts...');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    for (const worker of TEST_WORKERS) {
      console.log(`Creating ${worker.name}...`);
      
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(worker.pass, salt);

      const userRes = await client.query(
        'INSERT INTO users (phone_number, username, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (phone_number) DO UPDATE SET password_hash = $3 RETURNING id',
        [worker.phone, worker.name.split(' ')[0].toLowerCase(), hash, 'worker']
      );
      
      const userId = userRes.rows[0].id;

      await client.query(
        'INSERT INTO worker_profiles (user_id, full_name, display_name, trade, is_verified, location) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id) DO UPDATE SET trade = $4',
        [userId, worker.name, worker.name, worker.trade, true, 'Nairobi, Kenya']
      );
    }

    await client.query('COMMIT');
    console.log('✅ Seeding complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
