async function profileRoutes(fastify, options) {
  const { pool } = fastify;

  // 1. GET ME (Current User Profile)
  fastify.get('/me', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const userId = request.user.id;

    const res = await pool.query(`
      SELECT 
        u.id, 
        u.phone_number, 
        u.email, 
        u.role,
        wp.full_name,
        wp.trade,
        wp.location,
        wp.bio,
        wp.profile_image_url,
        wp.is_verified,
        wp.rating,
        wp.jobs_completed
      FROM users u
      LEFT JOIN worker_profiles wp ON u.id = wp.user_id
      WHERE u.id = $1
    `, [userId]);

    const user = res.rows[0];
    if (!user) {
      return reply.status(404).send({ message: 'Profile not found' });
    }

    return user;
  });

  // 2. GET WORKER BY ID (Public Profile)
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;

    const res = await pool.query(`
      SELECT 
        wp.full_name,
        wp.trade,
        wp.location,
        wp.bio,
        wp.profile_image_url,
        wp.is_verified,
        wp.rating,
        wp.jobs_completed
      FROM worker_profiles wp
      WHERE wp.user_id = $1
    `, [id]);

    const profile = res.rows[0];
    if (!profile) {
      return reply.status(404).send({ message: 'Profile not found' });
    }

    return profile;
  });
}

module.exports = profileRoutes;
