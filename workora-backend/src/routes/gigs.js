const { z } = require('zod');
const { parsePagination } = require('../lib/pagination');

async function gigRoutes(fastify) {
  const { pool } = fastify;
  const resolveActorId = (request) => request.user?.id;

  // 1. GET FEED (Home Screen Algorithm)
  fastify.get('/feed', async (request, reply) => {
    const { limit, offset } = parsePagination(request.query, { defaultLimit: 20, maxLimit: 50 });
    // Basic Algorithm: Recency + Engagement
    const res = await pool.query(`
      SELECT 
        g.*, 
        COALESCE(p.full_name, u.username) as user_name, 
        u.username as handle, 
        COALESCE(p.trade, 'Member') as trade, 
        COALESCE(p.is_verified, false) as verified,
        p.avatar_url,
        CASE
          WHEN $1::uuid IS NULL THEN false
          ELSE EXISTS (
            SELECT 1 FROM saved_gigs sg
            WHERE sg.gig_id = g.id AND sg.user_id = $1
          )
        END as saved_by_me,
        (SELECT COUNT(*) FROM gig_likes WHERE gig_id = g.id) as real_likes,
        (SELECT COUNT(*) FROM gig_comments WHERE gig_id = g.id) as real_comments
      FROM gigs g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN worker_profiles p ON u.id = p.user_id
      ORDER BY g.created_at DESC
      LIMIT $2 OFFSET $3
    `, [resolveActorId(request) || null, limit, offset]);
    return res.rows;
  });

  // 2. GET EXPLORE (Trending/Discovery)
  fastify.get('/explore', async (request, reply) => {
    const { limit, offset } = parsePagination(request.query, { defaultLimit: 30, maxLimit: 60 });
    const res = await pool.query(`
      SELECT g.*, COALESCE(p.trade, 'Member') as trade 
      FROM gigs g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN worker_profiles p ON u.id = p.user_id
      ORDER BY g.view_count DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return res.rows;
  });

  // 3. CREATE GIG
  fastify.post('/', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { worker_id, title, description, video_url, thumbnail_url, category } = request.body;
    const actorId = resolveActorId(request);
    const user_id = actorId;
    const res = await pool.query(
      `INSERT INTO gigs (user_id, worker_id, title, description, video_url, thumbnail_url, category) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, worker_id, title, description, video_url, thumbnail_url, category]
    );
    return res.rows[0];
  });

  // 4. LIKE/UNLIKE GIG
  fastify.post('/:id/like', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const user_id = resolveActorId(request);

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
  fastify.post('/:id/comment', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const { text } = request.body;
    const user_id = resolveActorId(request);
    const res = await pool.query(
      'INSERT INTO gig_comments (gig_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, text]
    );
    return res.rows[0];
  });

  // 7. GET STORIES (Recent active users)
  fastify.get('/stories', async (request, reply) => {
    const res = await pool.query(`
      SELECT DISTINCT ON (u.id) 
        u.id, 
        COALESCE(p.full_name, u.username) as name, 
        COALESCE(p.trade, 'Member') as trade, 
        COALESCE(p.is_verified, false) as verified
      FROM users u
      JOIN gigs g ON g.user_id = u.id
      LEFT JOIN worker_profiles p ON u.id = p.user_id
      ORDER BY u.id, g.created_at DESC
      LIMIT 12
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

  // 9. SAVED GIGS
  fastify.get('/saved/:userId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { userId } = request.params;
    if (request.user?.id && request.user.id !== userId) {
      return reply.status(403).send({ message: 'Forbidden' });
    }

    const res = await pool.query(`
      SELECT 
        g.*,
        COALESCE(p.full_name, u.username) as user_name,
        u.username as handle,
        COALESCE(p.trade, 'Member') as trade,
        COALESCE(p.is_verified, false) as verified,
        sg.created_at as saved_at,
        (SELECT COUNT(*) FROM gig_likes WHERE gig_id = g.id) as real_likes,
        (SELECT COUNT(*) FROM gig_comments WHERE gig_id = g.id) as real_comments
      FROM saved_gigs sg
      JOIN gigs g ON g.id = sg.gig_id
      JOIN users u ON g.user_id = u.id
      LEFT JOIN worker_profiles p ON u.id = p.user_id
      WHERE sg.user_id = $1
      ORDER BY sg.created_at DESC
    `, [userId]);

    return res.rows;
  });

  // 10. TOGGLE SAVE
  fastify.post('/:id/save', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const userId = resolveActorId(request);

    const existing = await pool.query(
      'SELECT id FROM saved_gigs WHERE gig_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM saved_gigs WHERE gig_id = $1 AND user_id = $2', [id, userId]);
      return { saved: false };
    }

    await pool.query('INSERT INTO saved_gigs (gig_id, user_id) VALUES ($1, $2)', [id, userId]);
    return { saved: true };
  });
}

module.exports = gigRoutes;
