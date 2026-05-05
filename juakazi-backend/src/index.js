require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const { Pool } = require('pg');

// Plugins
fastify.register(require('@fastify/cors'), { origin: '*' });
fastify.register(require('@fastify/jwt'), { secret: process.env.JWT_SECRET || 'juakazi-super-secret-2026' });

// Initialize Neon Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  ssl: { rejectUnauthorized: false }
});

// Decorate fastify with pool
fastify.decorate('pool', pool);

// Routes
fastify.register(require('./routes/auth'), { prefix: '/auth' });
fastify.register(require('./routes/profile'), { prefix: '/profile' });

// Health Check
fastify.get('/health', async () => ({ status: 'ok', service: 'juakazi-backend' }));

const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
