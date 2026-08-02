#!/bin/bash

echo "=== WORKORA BACKEND DIAGNOSTICS ==="
echo ""

# Check if backend container is running
echo "1. Checking Docker containers..."
sudo docker ps | grep workora

echo ""
echo "2. Checking backend logs (last 20 lines)..."
sudo docker logs --tail 20 workora-platform_backend_1

echo ""
echo "3. Checking database data..."
cd /home/lewis/workora-platform/workora-backend
node -e "
const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: 'postgresql://neondb_owner:npg_cOgvDbm42AXF@ep-nameless-thunder-al8gsrup-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

(async () => {
  try {
    const gigs = await pool.query('SELECT COUNT(*) FROM gigs');
    const users = await pool.query('SELECT COUNT(*) FROM users');
    console.log('Total gigs:', gigs.rows[0].count);
    console.log('Total users:', users.rows[0].count);
    
    if (gigs.rows[0].count === '0') {
      console.log('\\n⚠️  NO DATA FOUND - Need to re-seed!');
    } else {
      console.log('\\n✓ Data exists in database');
      const sample = await pool.query('SELECT id, title, user_id FROM gigs LIMIT 3');
      console.log('Sample gigs:', sample.rows);
    }
  } catch (err) {
    console.error('Database error:', err.message);
  } finally {
    await pool.end();
  }
})();
"

echo ""
echo "4. Testing backend API endpoint..."
curl -s http://localhost:3001/gigs/feed?page=1&limit=5 | head -c 200

echo ""
echo ""
echo "=== DIAGNOSTIC COMPLETE ==="
