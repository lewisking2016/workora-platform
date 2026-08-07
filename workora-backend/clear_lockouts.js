const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const url = (process.env.DATABASE_URL || '').replace(/^["'](.+)["']$/, '$1');
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const res = await client.query('DELETE FROM auth_login_attempts');
  console.log('Cleared auth_login_attempts rows:', res.rowCount);
  await client.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
