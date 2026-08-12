const bcrypt = require('bcryptjs');
const { z } = require('zod');

const registerSchema = z.object({
  phone_number: z.string().min(10),
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(6),
  full_name: z.string().min(2),
  trade: z.string().min(2),
  birthday: z.string().optional(),
  role: z.enum(['worker', 'hirer']).default('worker'),
});

const LOGIN_LOCK_THRESHOLD = 1000; // Presentation mode – effectively disabled
const LOGIN_LOCK_MINUTES = 1;

function buildAuthError(code, message, extras = {}) {
  return { code, message, ...extras };
}

async function authRoutes(fastify) {
  const { pool } = fastify;

  // 1. REGISTER
  fastify.post('/register', { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } }, async (request, reply) => {
    let validated;
    try {
      validated = registerSchema.parse(request.body);
    } catch (e) {
      return reply.status(400).send({ message: 'Validation failed', errors: e.errors });
    }
    const { phone_number, email, username, password, full_name, trade, birthday, role } = validated;

    console.log('[Register] Starting for:', phone_number);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    console.log('[Register] Password hashed');

    const client = await pool.connect();
    try {
      console.log('[Register] Database connection acquired');
      await client.query('BEGIN');
      console.log('[Register] Transaction started');

      // Create User
      const userRes = await client.query(
        'INSERT INTO users (phone_number, email, username, password_hash, role, birthday) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [phone_number, email || null, username || null, password_hash, role, birthday || null]
      );
      const userId = userRes.rows[0].id;
      console.log('[Register] User created:', userId);

      // Create Profile
      await client.query(
        'INSERT INTO worker_profiles (user_id, full_name, display_name, trade) VALUES ($1, $2, $3, $4)',
        [userId, full_name, full_name, trade]
      );
      console.log('[Register] Profile created');

      await client.query('COMMIT');
      console.log('[Register] Transaction committed');

      // Generate JWT
      const token = fastify.jwt.sign({ id: userId, role });
      return { token, user: { id: userId, username, full_name, role } };

    } catch (err) {
      console.error('[Register] CRITICAL ERROR:', err);
      await client.query('ROLLBACK');
      if (err.code === '23505') {
        if (err.constraint === 'users_phone_number_key' || err.detail?.includes('phone_number')) {
          return reply.status(400).send(buildAuthError('phone_already_used', 'Phone number already registered'));
        }
        if (err.constraint === 'users_email_key' || err.detail?.includes('email')) {
          return reply.status(400).send(buildAuthError('email_already_used', 'Email already registered'));
        }
        if (err.constraint === 'users_username_key' || err.detail?.includes('username')) {
          return reply.status(400).send(buildAuthError('username_already_used', 'Username already taken'));
        }
        return reply.status(400).send(buildAuthError('account_already_exists', 'Account already exists'));
      }
      throw err;
    } finally {
      client.release();
    }
  });

  // 2. LOGIN
  fastify.post('/login', { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } }, async (request, reply) => {
    const identifier = String(request.body?.identifier || request.body?.phone_number || '').trim();
    const password = request.body?.password;

    if (!identifier || !password) {
      return reply.status(400).send(buildAuthError('missing_credentials', 'Missing login credentials'));
    }

    const normalizedIdentifier = identifier.toLowerCase();

    // Accept Kenyan local numbers (07…) as E.164 (+2547…)
    const phoneCandidates = [identifier];
    if (/^0[17]\d{8}$/.test(identifier)) {
      phoneCandidates.push(`+254${identifier.slice(1)}`);
    } else if (/^[17]\d{8}$/.test(identifier)) {
      phoneCandidates.push(`+254${identifier}`);
    } else if (/^\+2540[17]\d{8}$/.test(identifier)) {
      phoneCandidates.push(`+254${identifier.slice(4)}`);
    }

    const attemptsRes = await pool.query(
      'SELECT failed_count, locked_until FROM auth_login_attempts WHERE identifier = $1 LIMIT 1',
      [normalizedIdentifier]
    );
    const attempt = attemptsRes.rows[0];

    const lockActive = Boolean(attempt?.locked_until && new Date(attempt.locked_until) > new Date());

    if (lockActive) {
      const minutesRemaining = Math.max(
        1,
        Math.ceil((new Date(attempt.locked_until).getTime() - Date.now()) / 60000)
      );
      return reply.status(429).send(
        buildAuthError('too_many_attempts', 'Too many attempts. Try again later.', {
          retry_after_minutes: minutesRemaining,
        })
      );
    }

    // If a previous lock has expired, restart the counter instead of
    // inheriting stale failures — otherwise one bad streak locks the
    // account forever (every new attempt re-locks it).

    const res = await pool.query(
      `
        SELECT *
        FROM users
        WHERE phone_number = ANY($1::text[])
           OR LOWER(username) = LOWER($2)
           OR LOWER(email) = LOWER($2)
        LIMIT 1
      `,
      [phoneCandidates, identifier]
    );
    const user = res.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      // Presentation mode: the counter only matters while a lock is active.
      // Once a lock expires (or for a fresh identifier), restart from zero
      // so a stale streak can never re-lock the account forever.
      const baseFailed = lockActive ? (attempt.failed_count || 0) : 0;
      const nextFailedCount = baseFailed + 1;
      const shouldLock = nextFailedCount >= LOGIN_LOCK_THRESHOLD;

      await pool.query(
        `
          INSERT INTO auth_login_attempts (identifier, failed_count, locked_until, last_failed_at, updated_at)
          VALUES (
            $1,
            $2,
            CASE WHEN $3::boolean THEN NOW() + INTERVAL '${LOGIN_LOCK_MINUTES} minutes' ELSE NULL END,
            NOW(),
            NOW()
          )
          ON CONFLICT (identifier)
          DO UPDATE SET
            failed_count = CASE
              WHEN auth_login_attempts.locked_until IS NOT NULL AND auth_login_attempts.locked_until > NOW()
                THEN auth_login_attempts.failed_count
              WHEN auth_login_attempts.failed_count >= $2 THEN auth_login_attempts.failed_count
              ELSE auth_login_attempts.failed_count + 1
            END,
            locked_until = CASE
              WHEN auth_login_attempts.locked_until IS NOT NULL AND auth_login_attempts.locked_until > NOW()
                THEN auth_login_attempts.locked_until
              WHEN EXCLUDED.failed_count >= $2 THEN NOW() + INTERVAL '${LOGIN_LOCK_MINUTES} minutes'
              ELSE NULL
            END,
            last_failed_at = NOW(),
            updated_at = NOW()
        `,
        [normalizedIdentifier, LOGIN_LOCK_THRESHOLD, shouldLock]
      );

      // Keep the attempts table small: drop rows with no active lock older than 7 days.
      await pool.query(
        `DELETE FROM auth_login_attempts
          WHERE (locked_until IS NULL OR locked_until <= NOW())
            AND last_failed_at < NOW() - INTERVAL '7 days'`
      ).catch(() => undefined);

      return reply.status(401).send(buildAuthError('invalid_credentials', 'Invalid credentials'));
    }

    await pool.query('DELETE FROM auth_login_attempts WHERE identifier = $1', [normalizedIdentifier]);

    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  });

  // 3. CURRENT USER
  fastify.get('/me', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const res = await pool.query(
      'SELECT id, username, phone_number, email, role, birthday, team_type, subscription, created_at FROM users WHERE id = $1',
      [userId]
    );

    const user = res.rows[0];
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        phone_number: user.phone_number,
        email: user.email,
        team_type: user.team_type,
        subscription: user.subscription,
        created_at: user.created_at,
      },
    };
  });

  // 4. UPDATE TEAM TYPE
  // Identity comes from the JWT — never from the request body.
  fastify.patch('/team', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' });

    const { team_type } = request.body || {};
    if (!['solo', 'team'].includes(team_type)) {
      return reply.status(400).send({ message: 'team_type must be "solo" or "team"' });
    }

    await pool.query('UPDATE users SET team_type = $1 WHERE id = $2', [team_type, userId]);
    return { success: true };
  });

  // 5. UPDATE SUBSCRIPTION
  // Identity comes from the JWT — never from the request body.
  fastify.patch('/subscription', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' });

    const { subscription } = request.body || {};
    if (!['free', 'elite'].includes(subscription)) {
      return reply.status(400).send({ message: 'subscription must be "free" or "elite"' });
    }

    await pool.query('UPDATE users SET subscription = $1 WHERE id = $2', [subscription, userId]);
    return { success: true };
  });

  // 6. PASSWORD RECOVERY REQUEST
  fastify.post('/forgot', { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, async (request, reply) => {
    const identifier = String(request.body?.identifier || '').trim();

    if (!identifier) {
      return reply.status(400).send({ message: 'Missing account identifier' });
    }

    const result = await pool.query(
      `
        SELECT id
        FROM users
        WHERE phone_number = $1
           OR LOWER(username) = LOWER($1)
           OR LOWER(email) = LOWER($1)
        LIMIT 1
      `,
      [identifier]
    );

    if (result.rows[0]) {
      request.log.info({ userId: result.rows[0].id }, 'Password recovery requested');
    }

    return {
      ok: true,
      message: 'If an account exists, recovery instructions have been queued.',
    };
  });
}

module.exports = authRoutes;
