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

async function authRoutes(fastify) {
  const { pool } = fastify;

  // 1. REGISTER
  fastify.post('/register', async (request, reply) => {
    const validated = registerSchema.parse(request.body);
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
        // Determine which field caused the duplicate
        if (err.detail && err.detail.includes('phone_number')) {
          return reply.status(400).send({ message: 'Phone number already registered' });
        }
        if (err.detail && err.detail.includes('username')) {
          return reply.status(400).send({ message: 'Username already taken' });
        }
        return reply.status(400).send({ message: 'Account already exists' });
      }
      throw err;
    } finally {
      client.release();
    }
  });

  // 2. LOGIN
  fastify.post('/login', async (request, reply) => {
    const { phone_number, password } = request.body;

    const res = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
    const user = res.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  });

  // 3. UPDATE TEAM TYPE
  fastify.patch('/team', async (request, reply) => {
    const { userId, team_type } = request.body;
    await pool.query('UPDATE users SET team_type = $1 WHERE id = $2', [team_type, userId]);
    return { success: true };
  });

  // 4. UPDATE SUBSCRIPTION
  fastify.patch('/subscription', async (request, reply) => {
    const { userId, subscription } = request.body;
    await pool.query('UPDATE users SET subscription = $1 WHERE id = $2', [subscription, userId]);
    return { success: true };
  });
}

module.exports = authRoutes;
