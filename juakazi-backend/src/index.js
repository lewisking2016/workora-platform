require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Plugins
fastify.register(require('@fastify/cors'), { origin: '*' });
fastify.register(require('@fastify/jwt'), { secret: process.env.JWT_SECRET || 'juakazi-super-secret-2026' });

// Helper to clean env variables (strips accidental quotes from Docker/Shell)
const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;

// Initialize Neon Database Pool
const pool = new Pool({
  connectionString: cleanEnv(process.env.DATABASE_URL),
  max: 5,
  ssl: { rejectUnauthorized: false }
});

// Decorate fastify with pool
fastify.decorate('pool', pool);

const dbUrl = cleanEnv(process.env.DATABASE_URL);
if (dbUrl) {
  console.log(`[DB] Using Connection: ${dbUrl.substring(0, 15)}...${dbUrl.substring(dbUrl.length - 10)}`);
} else {
  console.error('[DB] DATABASE_URL is NOT defined!');
}

// Auto-Migration: Create tables on startup if they don't exist
async function autoMigrate() {
  const client = await pool.connect();
  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    fastify.log.info('Auto-migration complete — all tables verified.');
  } catch (err) {
    fastify.log.error({ err }, 'Auto-migration failed — check schema.sql');
  } finally {
    client.release();
  }
}

// Routes
fastify.register(require('./routes/auth'), { prefix: '/auth' });
fastify.register(require('./routes/profile'), { prefix: '/profile' });

// Health Check
fastify.get('/health', async () => ({ status: 'ok', service: 'juakazi-backend' }));

const start = async () => {
  try {
    // Run auto-migration before listening
    await autoMigrate();

    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
