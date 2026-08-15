const { z } = require('zod');
const { parsePagination } = require('../lib/pagination');
// const { getCachedFeed, invalidateCache, cachePost, getCachedPost } = require('../lib/cache');

async function gigRoutes(fastify) {
  const { pool } = fastify;
  const resolveActorId = (request) => request.user?.id;
  const gigAuthorJoins = `
      LEFT JOIN worker_profiles wp ON wp.id = g.worker_id
      LEFT JOIN worker_profiles up ON up.user_id = g.user_id
      LEFT JOIN users u ON u.id = COALESCE(g.user_id, wp.user_id, up.user_id)
  `;

  // 1. GET FEED (Home Screen Algorithm) - DIRECT QUERY (CACHE DISABLED)
  fastify.get('/feed', async (request, reply) => {
    const { limit, offset } = parsePagination(request.query, { defaultLimit: 20, maxLimit: 50 });
    const scope = String(request.query.scope || 'new').toLowerCase();
    const trade = request.query.trade ? String(request.query.trade) : null;
    const actorId = resolveActorId(request) || null;

    // Use real_likes (computed) — never base.likes_count (ambiguous when gigs.likes_count exists)
    const orderBy = ({
      new: 'base.created_at DESC',
      trending: 'base.view_count DESC, base.real_likes DESC, base.created_at DESC',
      recommended: 'base.creator_trust_score DESC, base.real_likes DESC, base.created_at DESC',
      following: 'base.created_at DESC',
      nearby: 'base.created_at DESC',
      reels: 'base.view_count DESC, base.real_likes DESC, base.created_at DESC'
    })[scope] || 'base.created_at DESC';

    const tradeClause = trade ? 'AND base.trade ILIKE $4' : '';
    const scopeClause = ({
      following: 'AND ($1::uuid IS NULL OR EXISTS (SELECT 1 FROM user_follows uf WHERE uf.follower_id = $1 AND uf.following_user_id = base.creator_user_id))',
      nearby: `AND (
        $1::uuid IS NULL
        OR COALESCE(base.creator_location, '') = COALESCE((SELECT location FROM worker_profiles WHERE user_id = $1 LIMIT 1), '')
      )`,
      reels: "AND COALESCE(base.video_url, '') <> ''",
      trending: '',
      recommended: '',
      new: ''
    })[scope] || '';

    try {
      const res = await pool.query(`
        WITH base AS (
          SELECT
            g.id,
            g.worker_id,
            g.user_id,
            g.title,
            g.description,
            g.category,
            g.video_url,
            g.thumbnail_url,
            g.view_count,
            g.created_at,
            COALESCE(wp.full_name, up.full_name, u.username, 'Member') AS user_name,
            COALESCE(u.username, 'member') AS handle,
            COALESCE(wp.trade, up.trade, g.category, 'Member') AS trade,
            COALESCE(wp.is_verified, up.is_verified, false) AS verified,
            COALESCE(wp.avatar_url, up.avatar_url) AS avatar_url,
            COALESCE(wp.location, up.location, 'Kenya') AS creator_location,
            COALESCE(wp.trust_score, up.trust_score, 0) AS creator_trust_score,
            COALESCE(g.user_id, wp.user_id, up.user_id) AS creator_user_id,
            CASE
              WHEN $1::uuid IS NULL THEN false
              ELSE EXISTS (
                SELECT 1 FROM saved_gigs sg
                WHERE sg.gig_id = g.id AND sg.user_id = $1
              )
            END AS saved_by_me,
            (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) AS likes_count,
            (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) AS comments_count,
            (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) AS real_likes,
            (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) AS real_comments,
            CASE
              WHEN $1::uuid IS NULL THEN false
              ELSE EXISTS (
                SELECT 1 FROM gig_likes gl
                WHERE gl.gig_id = g.id AND gl.user_id = $1
              )
            END AS liked_by_me,
            CASE
              WHEN $1::uuid IS NULL THEN false
              ELSE EXISTS (
                SELECT 1 FROM user_follows uf
                WHERE uf.follower_id = $1 AND uf.following_user_id = COALESCE(g.user_id, wp.user_id, up.user_id)
              )
            END AS following_by_me
          FROM gigs g
          ${gigAuthorJoins}
        )
        SELECT *
        FROM base
        WHERE 1 = 1
          ${tradeClause}
          ${scopeClause}
          AND ($1::uuid IS NULL OR NOT EXISTS (
            SELECT 1 FROM gig_hides gh
            WHERE gh.user_id = $1 AND gh.gig_id = base.id
          ))
          AND ($1::uuid IS NULL OR NOT EXISTS (
            SELECT 1 FROM user_mutes um
            WHERE um.user_id = $1 AND um.muted_user_id = base.creator_user_id
          ))
          AND ($1::uuid IS NULL OR NOT EXISTS (
            SELECT 1 FROM user_blocks ub
            WHERE ub.blocker_id = $1 AND ub.blocked_user_id = base.creator_user_id
          ))
        ORDER BY ${orderBy}
        LIMIT $2 OFFSET $3
      `, trade ? [actorId, limit, offset, `%${trade}%`] : [actorId, limit, offset]);

      return res.rows;
    } catch (err) {
      request.log.error({ err, scope }, 'Feed query failed — falling back to simple list');
      const fallback = await pool.query(`
        SELECT
          g.id, g.worker_id, g.user_id, g.title, g.description, g.category,
          g.video_url, g.thumbnail_url, g.view_count, g.created_at,
          COALESCE(wp.full_name, up.full_name, u.username, 'Member') AS user_name,
          COALESCE(u.username, 'member') AS handle,
          COALESCE(wp.trade, up.trade, g.category, 'Member') AS trade,
          COALESCE(wp.is_verified, up.is_verified, false) AS verified,
          COALESCE(wp.avatar_url, up.avatar_url) AS avatar_url,
          COALESCE(g.user_id, wp.user_id, up.user_id) AS creator_user_id,
          false AS saved_by_me,
          false AS liked_by_me,
          false AS following_by_me,
          (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) AS likes_count,
          (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) AS comments_count,
          (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) AS real_likes,
          (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) AS real_comments
        FROM gigs g
        ${gigAuthorJoins}
        WHERE COALESCE(g.video_url, '') <> ''
        ORDER BY g.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);
      return fallback.rows;
    }
  });

  // 2. GET EXPLORE (Trending/Discovery) - DIRECT QUERY (CACHE DISABLED)
  fastify.get('/explore', async (request, reply) => {
    const { limit, offset } = parsePagination(request.query, { defaultLimit: 30, maxLimit: 60 });
    
    const res = await pool.query(`
      SELECT g.*, 
        COALESCE(wp.full_name, up.full_name, u.username, 'Member') as user_name,
        COALESCE(u.username, 'member') as handle,
        COALESCE(wp.trade, up.trade, g.category, 'Member') as trade,
        COALESCE(wp.is_verified, up.is_verified, false) as verified,
        (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) as likes_count,
        (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) as comments_count,
        (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) as real_likes,
        (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) as real_comments
      FROM gigs g
      ${gigAuthorJoins}
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

  // 4. GET SINGLE GIG
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;

    const res = await pool.query(`
      SELECT
        g.*,
        COALESCE(wp.full_name, up.full_name, u.username, 'Member') as user_name,
        COALESCE(u.username, 'member') as handle,
        COALESCE(wp.trade, up.trade, g.category, 'Member') as trade,
        COALESCE(wp.is_verified, up.is_verified, false) as verified,
        COALESCE(wp.avatar_url, up.avatar_url) as avatar_url,
        (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) as likes_count,
        (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) as comments_count,
        (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) as real_likes,
        (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) as real_comments,
        CASE
          WHEN $2::uuid IS NULL THEN false
          ELSE EXISTS (
            SELECT 1 FROM gig_likes gl
            WHERE gl.gig_id = g.id AND gl.user_id = $2
          )
        END as liked_by_me,
        CASE
          WHEN $2::uuid IS NULL THEN false
          ELSE EXISTS (
            SELECT 1 FROM saved_gigs sg
            WHERE sg.gig_id = g.id AND sg.user_id = $2
          )
        END as saved_by_me
      FROM gigs g
      ${gigAuthorJoins}
      WHERE g.id = $1
      LIMIT 1
    `, [id, resolveActorId(request) || null]);

    if (!res.rows[0]) {
      return reply.status(404).send({ message: 'Gig not found' });
    }

    return res.rows[0];
  });

  // 5. LIKE/UNLIKE GIG
  fastify.post('/:id/like', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const user_id = resolveActorId(request);

    try {
      const gig = await pool.query('SELECT id FROM gigs WHERE id = $1', [id]);
      if (gig.rows.length === 0) {
        return reply.status(404).send({ message: 'Gig not found' });
      }

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

  // 6. GET COMMENTS
  // Record a real view — deduped per (gig, session) so refreshes and
  // single-session bots count once. Only fresh sessions bump view_count.
  fastify.post('/:id/view', async (request, reply) => {
    let userId = null;
    try {
      await request.jwtVerify();
      userId = request.user?.id || null;
    } catch { /* views are anonymous-friendly */ }

    const sessionId = String(request.body?.session_id || request.headers['x-session-id'] || '').slice(0, 128);
    if (!sessionId) {
      return reply.status(400).send({ message: 'session_id is required' });
    }

    const insert = await pool.query(
      `INSERT INTO gig_views (gig_id, user_id, session_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (gig_id, session_id) DO NOTHING
       RETURNING id`,
      [request.params.id, userId, sessionId]
    );

    if (insert.rows.length > 0) {
      await pool.query(
        `UPDATE gigs SET view_count = view_count + 1 WHERE id = $1`,
        [request.params.id]
      );
      return { viewed: true, first_time: true };
    }

    return { viewed: true, first_time: false };
  });

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

  // 6b. GET LIKES
  fastify.get('/:id/likes', async (request, reply) => {
    const { id } = request.params;
    const res = await pool.query(`
      SELECT
        gl.id,
        gl.created_at,
        COALESCE(wp.full_name, u.username, 'Member') AS username,
        COALESCE(wp.trade, 'Member') AS trade,
        COALESCE(wp.is_verified, false) AS verified
      FROM gig_likes gl
      LEFT JOIN users u ON u.id = gl.user_id
      LEFT JOIN worker_profiles wp ON wp.user_id = gl.user_id
      WHERE gl.gig_id = $1
      ORDER BY gl.created_at DESC
      LIMIT 30
    `, [id]);
    return res.rows;
  });

  // 7. ADD COMMENT
  fastify.post('/:id/comment', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const { text } = request.body;
    const user_id = resolveActorId(request);

    const gig = await pool.query('SELECT id FROM gigs WHERE id = $1', [id]);
    if (gig.rows.length === 0) {
      return reply.status(404).send({ message: 'Gig not found' });
    }

    const res = await pool.query(
      'INSERT INTO gig_comments (gig_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, text]
    );
    return res.rows[0];
  });

  // 8. GET STORIES (Recent active users)
  fastify.get('/stories', async (request, reply) => {
    const res = await pool.query(`
      SELECT DISTINCT ON (COALESCE(g.user_id, wp.user_id, up.user_id)) 
        COALESCE(g.user_id, wp.user_id, up.user_id) as id, 
        COALESCE(wp.user_id, up.user_id, g.user_id) as worker_user_id,
        g.worker_id,
        g.id as gig_id,
        g.video_url,
        g.thumbnail_url,
        g.created_at as last_story_at,
        COALESCE(wp.full_name, up.full_name, u.username, 'Member') as name, 
        COALESCE(wp.trade, up.trade, 'Member') as trade, 
        COALESCE(wp.is_verified, up.is_verified, false) as verified
      FROM gigs g
      LEFT JOIN worker_profiles wp ON wp.id = g.worker_id
      LEFT JOIN worker_profiles up ON up.user_id = g.user_id
      LEFT JOIN users u ON u.id = COALESCE(g.user_id, wp.user_id, up.user_id)
      ORDER BY COALESCE(g.user_id, wp.user_id, up.user_id), g.created_at DESC
      LIMIT 12
    `);
    return res.rows;
  });

  // 9. GET WORKER GIGS
  fastify.get('/worker/:workerId', async (request, reply) => {
    const { workerId } = request.params;
    const res = await pool.query(`
      SELECT * FROM gigs WHERE worker_id = $1 ORDER BY created_at DESC
    `, [workerId]);
    return res.rows;
  });

  // 10. SAVED GIGS
  fastify.get('/saved/:userId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { userId } = request.params;
    if (request.user?.id && request.user.id !== userId) {
      return reply.status(403).send({ message: 'Forbidden' });
    }

    const res = await pool.query(`
      SELECT 
        g.*,
        COALESCE(wp.full_name, up.full_name, u.username, 'Member') as user_name,
        COALESCE(u.username, 'member') as handle,
        COALESCE(wp.trade, up.trade, g.category, 'Member') as trade,
        COALESCE(wp.is_verified, up.is_verified, false) as verified,
        sg.created_at as saved_at,
        (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) as likes_count,
        (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) as comments_count,
        (SELECT COUNT(*)::int FROM gig_likes WHERE gig_id = g.id) as real_likes,
        (SELECT COUNT(*)::int FROM gig_comments WHERE gig_id = g.id) as real_comments
      FROM saved_gigs sg
      JOIN gigs g ON g.id = sg.gig_id
      LEFT JOIN worker_profiles wp ON wp.id = g.worker_id
      LEFT JOIN worker_profiles up ON up.user_id = g.user_id
      LEFT JOIN users u ON u.id = COALESCE(g.user_id, wp.user_id, up.user_id)
      WHERE sg.user_id = $1
      ORDER BY sg.created_at DESC
    `, [userId]);

    return res.rows;
  });

  // 11. TOGGLE SAVE
  fastify.post('/:id/save', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const userId = resolveActorId(request);

    const gig = await pool.query('SELECT id FROM gigs WHERE id = $1', [id]);
    if (gig.rows.length === 0) {
      return reply.status(404).send({ message: 'Gig not found' });
    }

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

  // 12. HIDE POST
  fastify.post('/:id/hide', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const userId = resolveActorId(request);
    const reason = String(request.body?.reason || 'hidden by user');

    await pool.query(
      `
        INSERT INTO gig_hides (user_id, gig_id, reason)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, gig_id)
        DO UPDATE SET reason = EXCLUDED.reason, created_at = CURRENT_TIMESTAMP
      `,
      [userId, id, reason]
    );

    return { hidden: true };
  });

  // 13. REPORT POST
  fastify.post('/:id/report', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const userId = resolveActorId(request);
    const reason = String(request.body?.reason || 'other');
    const details = String(request.body?.details || '');

    const res = await pool.query(
      'INSERT INTO gig_reports (user_id, gig_id, reason, details) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, id, reason, details || null]
    );

    return { reported: true, report_id: res.rows[0]?.id };
  });
}

module.exports = gigRoutes;
