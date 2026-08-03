async function notificationRoutes(fastify) {
  const { pool } = fastify;

  fastify.get('/', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const profileRes = await pool.query('SELECT id FROM worker_profiles WHERE user_id = $1 LIMIT 1', [userId]);
    const profileId = profileRes.rows[0]?.id || null;

    if (!profileId) return [];

    const result = await pool.query(
      `
      WITH owned_gigs AS (
        SELECT id FROM gigs WHERE worker_id = $1
      ),
      likes AS (
        SELECT
          gl.id::text AS id,
          'like'::text AS type,
          gl.user_id AS actor_id,
          COALESCE(u.username, 'Member') AS actor_name,
          COALESCE(wp.trade, 'Member') AS actor_trade,
          COALESCE(wp.is_verified, false) AS actor_verified,
          gl.gig_id,
          g.created_at
        FROM gig_likes gl
        JOIN owned_gigs og ON og.id = gl.gig_id
        JOIN gigs g ON g.id = gl.gig_id
        LEFT JOIN users u ON u.id = gl.user_id
        LEFT JOIN worker_profiles wp ON wp.user_id = gl.user_id
      ),
      comments AS (
        SELECT
          gc.id::text AS id,
          'comment'::text AS type,
          gc.user_id AS actor_id,
          COALESCE(u.username, 'Member') AS actor_name,
          COALESCE(wp.trade, 'Member') AS actor_trade,
          COALESCE(wp.is_verified, false) AS actor_verified,
          gc.gig_id,
          gc.created_at
        FROM gig_comments gc
        JOIN owned_gigs og ON og.id = gc.gig_id
        JOIN gigs g ON g.id = gc.gig_id
        LEFT JOIN users u ON u.id = gc.user_id
        LEFT JOIN worker_profiles wp ON wp.user_id = gc.user_id
      ),
      rating_rows AS (
        SELECT
          r.id::text AS id,
          'rating'::text AS type,
          r.from_user_id AS actor_id,
          COALESCE(u.username, 'Member') AS actor_name,
          COALESCE(wp.trade, 'Member') AS actor_trade,
          COALESCE(wp.is_verified, false) AS actor_verified,
          r.gig_id,
          r.created_at
        FROM ratings r
        JOIN owned_gigs og ON og.id = r.gig_id
        LEFT JOIN users u ON u.id = r.from_user_id
        LEFT JOIN worker_profiles wp ON wp.user_id = r.from_user_id
      )
      SELECT *
      FROM (
        SELECT * FROM likes
        UNION ALL
      SELECT * FROM comments
      UNION ALL
      SELECT * FROM rating_rows
      ) activity
      ORDER BY created_at DESC
      LIMIT 30
      `,
      [profileId]
    );

    return result.rows.map((row) => {
      let text = 'interacted with your content';
      if (row.type === 'like') text = 'liked your post';
      if (row.type === 'comment') text = 'commented on your post';
      if (row.type === 'rating') text = 'rated your work';

      return {
        id: row.id,
        type: row.type,
        actor_id: row.actor_id,
        actor_name: row.actor_name,
        actor_trade: row.actor_trade,
        actor_verified: row.actor_verified,
        gig_id: row.gig_id,
        text,
        created_at: row.created_at,
      };
    });
  });
}

module.exports = notificationRoutes;
