require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Plugins
fastify.register(require('@fastify/cors'), { origin: '*' });
fastify.register(require('@fastify/jwt'), { secret: process.env.JWT_SECRET || 'workora-super-secret-2026' });
fastify.register(require('@fastify/multipart'), { limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB max

fastify.decorate('authenticate', async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
});

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
fastify.register(require('./routes/gigs'), { prefix: '/gigs' });
fastify.register(require('./routes/notifications'), { prefix: '/notifications' });
fastify.register(require('./routes/upload'), { prefix: '/upload' });
fastify.register(require('./routes/messages'), { prefix: '/messages' });
fastify.register(require('./routes/analytics'), { prefix: '/analytics' });

// System Settings
fastify.get('/settings', async (request, reply) => {
  const { pool } = fastify;
  try {
    const res = await pool.query('SELECT key, value FROM system_settings');
    const settings = {};
    res.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    return settings;
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return reply.status(500).send({ error: 'Failed to fetch settings' });
  }
});

// Health Check
fastify.get('/health', async () => ({ status: 'ok', service: 'workora-backend' }));

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
