require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Helper to clean env variables (strips accidental quotes from Docker/Shell)
const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;

// Security: fail fast in production when JWT_SECRET is missing — never fall back to a hardcoded secret.
const jwtSecret = cleanEnv(process.env.JWT_SECRET);
const databaseUrl = cleanEnv(process.env.DATABASE_URL);
const nodeEnv = process.env.NODE_ENV || 'development';

if (!jwtSecret) {
  if (nodeEnv === 'production') {
    console.error('[FATAL] JWT_SECRET is required in production. Refusing to start.');
    process.exit(1);
  }
  console.warn('[WARN] JWT_SECRET not set — using a development-only secret. Set JWT_SECRET in production.');
}
const resolvedJwtSecret = jwtSecret || 'workora-dev-secret-2026';

if (!databaseUrl) {
  console.error('[FATAL] DATABASE_URL is required. Refusing to start.');
  process.exit(1);
}

// Warn about insecure production config
if (nodeEnv === 'production') {
  if (resolvedJwtSecret === 'workora-dev-secret-2026') {
    console.error('[FATAL] Using default JWT_SECRET in production. Refusing to start.');
    process.exit(1);
  }
}

// CORS: allow explicit origins only (defaults to local dev + the public web app).
// Mobile (Flutter) requests carry no Origin header, so they are unaffected by CORS.
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,https://workora.imeantech.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Plugins
fastify.register(require('@fastify/cors'), {
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Range'],
  credentials: false,
});

// Rate limiting: opt-in per route (login/register/forgot). Not global, so
// regular browsing/API traffic is never throttled and health checks don't
// consume auth quotas.
fastify.register(require('@fastify/rate-limit'), {
  global: false,
  max: 600,
  timeWindow: '1 minute',
});

fastify.register(require('@fastify/jwt'), { secret: resolvedJwtSecret });  // 300MB upload cap — comfortably above the web client's 250MB limit so no
  // legitimate phone/drone video is ever rejected server-side.
  fastify.register(require('@fastify/multipart'), { limits: { fileSize: 300 * 1024 * 1024 } });

fastify.decorate('authenticate', async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
});

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

// Split a SQL file into individual statements so one failing statement
// cannot roll back the whole schema (pg runs a multi-statement query as
// a single transaction). Handles single-quoted strings and $$ … $$ blocks.
function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let i = 0;
  const n = sql.length;

  while (i < n) {
    const ch = sql[i];

    if (ch === '-' && sql[i + 1] === '-') {
      // Line comment: copy to end of line so apostrophes inside comments
      // are never mistaken for string delimiters.
      while (i < n && sql[i] !== '\n') {
        current += sql[i];
        i += 1;
      }
      continue;
    }

    if (ch === "'") {
      current += ch;
      i += 1;
      while (i < n) {
        current += sql[i];
        if (sql[i] === "'") {
          if (sql[i + 1] === "'") {
            current += sql[i + 1];
            i += 2;
            continue;
          }
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }

    if (ch === '$' && sql[i + 1] === '$') {
      const start = i;
      i += 2;
      while (i < n && !(sql[i] === '$' && sql[i + 1] === '$')) {
        i += 1;
      }
      i += 2;
      current += sql.slice(start, i);
      continue;
    }

    if (ch === ';') {
      if (current.trim()) statements.push(current.trim());
      current = '';
      i += 1;
      continue;
    }

    current += ch;
    i += 1;
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

// Auto-Migration: Create tables on startup if they don't exist.
// Statements run individually so one failure is logged and skipped instead
// of rolling back the entire schema (which previously left the DB stuck
// on the legacy schema_v2 shape).
async function autoMigrate() {
  const client = await pool.connect();
  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const statements = splitSqlStatements(schemaSql);

    let applied = 0;
    let skipped = 0;
    for (const statement of statements) {
      try {
        await client.query(statement);
        applied += 1;
      } catch (err) {
        skipped += 1;
        fastify.log.warn(
          { err: String(err?.message || err), statement: statement.slice(0, 120) },
          'Migration statement skipped'
        );
      }
    }
    fastify.log.info(`Auto-migration complete — ${applied} statements applied, ${skipped} skipped.`);
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
fastify.register(require('./routes/jobs'), { prefix: '/jobs' });
fastify.register(require('./routes/payments'), { prefix: '/payments' });

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
