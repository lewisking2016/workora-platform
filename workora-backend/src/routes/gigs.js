const { z } = require('zod');

async function gigRoutes(fastify) {
  const { pool } = fastify;

  // 1. GET FEED (Home Screen Algorithm)
  fastify.get('/feed', async (request, reply) => {
    // Basic Algorithm: Recency + Engagement
    // In a real app, this would be personalized based on follower_id
    const res = await pool.query(`
      SELECT 
        g.*, 
        p.full_name as user_name, 
        p.display_name as handle, 
        p.trade, 
        p.is_verified as verified,
        p.avatar_url,
        (SELECT COUNT(*) FROM gig_likes WHERE gig_id = g.id) as real_likes,
        (SELECT COUNT(*) FROM gig_comments WHERE gig_id = g.id) as real_comments
      FROM gigs g
      JOIN worker_profiles p ON g.worker_id = p.id
      ORDER BY g.created_at DESC
      LIMIT 20
    `);
    return res.rows;
  });

  // 2. GET EXPLORE (Trending/Discovery)
  fastify.get('/explore', async (request, reply) => {
    const res = await pool.query(`
      SELECT g.*, p.trade 
      FROM gigs g
      JOIN worker_profiles p ON g.worker_id = p.id
      ORDER BY g.view_count DESC
      LIMIT 30
    `);
    return res.rows;
  });

  // 3. CREATE GIG
  fastify.post('/', async (request, reply) => {
    const { worker_id, title, description, video_url, thumbnail_url, category } = request.body;
    const res = await pool.query(
      `INSERT INTO gigs (worker_id, title, description, video_url, thumbnail_url, category) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [worker_id, title, description, video_url, thumbnail_url, category]
    );
    return res.rows[0];
  });

  // 4. LIKE/UNLIKE GIG
  fastify.post('/:id/like', async (request, reply) => {
    const { id } = request.params;
    const { user_id } = request.body;

    try {
      const existing = await pool.query('SELECT * FROM gig_likes WHERE gig_id = $1 AND user_id = $2', [id, user_id]);
      if (existing.rows.length > 0) {
        await pool.query('DELETE FROM gig_likes WHERE gig_id = $1 AND user_id = $2', [id, user_id]);
        return { liked: false };
      } else {
        await pool.query('INSERT INTO gig_likes (gig_id, user_id) VALUES ($1, $2)', [id, user_id]);
        return { liked: true };
      }
    } catch (err) {
      return reply.status(500).send({ error: 'Action failed' });
    }
  });

  // 5. GET COMMENTS
  fastify.get('/:id/comments', async (request, reply) => {
    const { id } = request.params;
    const res = await pool.query(`
      SELECT c.*, u.username, u.role
      FROM gig_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.gig_id = $1
      ORDER BY c.created_at DESC
    `, [id]);
    return res.rows;
  });

  // 6. ADD COMMENT
  fastify.post('/:id/comment', async (request, reply) => {
    const { id } = request.params;
    const { user_id, text } = request.body;
    const res = await pool.query(
      'INSERT INTO gig_comments (gig_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, text]
    );
    return res.rows[0];
  });

  // 7. GET STORIES (Latest from verified pros)
  fastify.get('/stories', async (request, reply) => {
    const res = await pool.query(`
      SELECT DISTINCT ON (p.id) p.id, p.full_name as name, p.trade, p.is_verified as verified
      FROM worker_profiles p
      JOIN gigs g ON g.worker_id = p.id
      WHERE p.is_verified = true
      ORDER BY p.id, g.created_at DESC
      LIMIT 10
    `);
    return res.rows;
  });

  // 8. GET WORKER GIGS
  fastify.get('/worker/:workerId', async (request, reply) => {
    const { workerId } = request.params;
    const res = await pool.query(`
      SELECT * FROM gigs WHERE worker_id = $1 ORDER BY created_at DESC
    `, [workerId]);
    return res.rows;
  });
}

module.exports = gigRoutes;
