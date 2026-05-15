require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Neon Database...');
    await client.connect();
    
    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log('Executing schema...');
    await client.query(schemaSql);
    
    console.log('✅ Database Schema created successfully!');
  } catch (err) {
    console.error('❌ Error creating database:', err);
  } finally {
    await client.end();
  }
}

setupDatabase();
