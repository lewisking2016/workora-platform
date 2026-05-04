const bcrypt = require('bcryptjs');
const { z } = require('zod');

const registerSchema = z.object({
  phone_number: z.string().min(10),
  email: z.string().email().optional(),
  password: z.string().min(6),
  full_name: z.string().min(2),
  trade: z.string().min(2),
  role: z.enum(['worker', 'hirer']).default('worker'),
});

async function authRoutes(fastify, options) {
  const { pool } = fastify;

  // 1. REGISTER
  fastify.post('/register', async (request, reply) => {
    const validated = registerSchema.parse(request.body);
    const { phone_number, email, password, full_name, trade, role } = validated;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create User
      const userRes = await client.query(
        'INSERT INTO users (phone_number, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [phone_number, email, password_hash, role]
      );
      const userId = userRes.rows[0].id;

      // Create Profile
      await client.query(
        'INSERT INTO worker_profiles (user_id, full_name, trade) VALUES ($1, $2, $3)',
        [userId, full_name, trade]
      );

      await client.query('COMMIT');

      // Generate JWT
      const token = fastify.jwt.sign({ id: userId, role });
      return { token, user: { id: userId, full_name, role } };

    } catch (err) {
      await client.query('ROLLBACK');
      if (err.code === '23505') {
        return reply.status(400).send({ message: 'Phone number or email already exists' });
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
    return { token, user: { id: user.id, role: user.role } };
  });
}

module.exports = authRoutes;
