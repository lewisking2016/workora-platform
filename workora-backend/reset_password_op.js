const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.replace(/^["'](.+)["']$/, '$1'),
  ssl: { rejectUnauthorized: false }
});

async function resetPassword() {
  const newPassword = 'lewisking2005';
  const phoneNumber = '+254114971070';

  try {
    console.log(`Generating hash for new password...`);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    console.log(`Updating database for ${phoneNumber}...`);
    const res = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE phone_number = $2 RETURNING id',
      [hash, phoneNumber]
    );

    if (res.rowCount > 0) {
      console.log('✅ Password reset successfully!');
    } else {
      console.error('❌ User not found.');
    }
  } catch (err) {
    console.error('Error resetting password:', err);
  } finally {
    await pool.end();
  }
}

resetPassword();
