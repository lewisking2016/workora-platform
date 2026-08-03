async function notificationRoutes(fastify) {
  const { pool } = fastify;

  const buildActivityRows = async (profileId, userId) => {
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
          gl.gig_id AS gig_id,
          g.created_at,
          COALESCE(nr.id IS NOT NULL, false) AS is_read
        FROM gig_likes gl
        JOIN owned_gigs og ON og.id = gl.gig_id
        JOIN gigs g ON g.id = gl.gig_id
        LEFT JOIN users u ON u.id = gl.user_id
        LEFT JOIN worker_profiles wp ON wp.user_id = gl.user_id
        LEFT JOIN notification_reads nr ON nr.user_id = $2 AND nr.notification_type = 'like' AND nr.source_id = gl.id::text
      ),
      comments AS (
        SELECT
          gc.id::text AS id,
          'comment'::text AS type,
          gc.user_id AS actor_id,
          COALESCE(u.username, 'Member') AS actor_name,
          COALESCE(wp.trade, 'Member') AS actor_trade,
          COALESCE(wp.is_verified, false) AS actor_verified,
          gc.gig_id AS gig_id,
          gc.created_at,
          COALESCE(nr.id IS NOT NULL, false) AS is_read
        FROM gig_comments gc
        JOIN owned_gigs og ON og.id = gc.gig_id
        JOIN gigs g ON g.id = gc.gig_id
        LEFT JOIN users u ON u.id = gc.user_id
        LEFT JOIN worker_profiles wp ON wp.user_id = gc.user_id
        LEFT JOIN notification_reads nr ON nr.user_id = $2 AND nr.notification_type = 'comment' AND nr.source_id = gc.id::text
      ),
      rating_rows AS (
        SELECT
          r.id::text AS id,
          'rating'::text AS type,
          r.from_user_id AS actor_id,
          COALESCE(u.username, 'Member') AS actor_name,
          COALESCE(wp.trade, 'Member') AS actor_trade,
          COALESCE(wp.is_verified, false) AS actor_verified,
          r.gig_id AS gig_id,
          r.created_at,
          COALESCE(nr.id IS NOT NULL, false) AS is_read
        FROM ratings r
        JOIN owned_gigs og ON og.id = r.gig_id
        LEFT JOIN users u ON u.id = r.from_user_id
        LEFT JOIN worker_profiles wp ON wp.user_id = r.from_user_id
        LEFT JOIN notification_reads nr ON nr.user_id = $2 AND nr.notification_type = 'rating' AND nr.source_id = r.id::text
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
      [profileId, userId]
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
        is_read: row.is_read,
      };
    });
  };

  const getProfileId = async (userId) => {
    const profileRes = await pool.query('SELECT id FROM worker_profiles WHERE user_id = $1 LIMIT 1', [userId]);
    return profileRes.rows[0]?.id || null;
  };

  fastify.get('/', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const profileId = await getProfileId(userId);
    if (!profileId) return [];

    return buildActivityRows(profileId, userId);
  });

  fastify.get('/settings', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const res = await pool.query('SELECT * FROM notification_preferences WHERE user_id = $1 LIMIT 1', [userId]);
    if (res.rows[0]) {
      return res.rows[0];
    }

    const inserted = await pool.query(
      `
      INSERT INTO notification_preferences (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
      RETURNING *
      `,
      [userId]
    );

    return inserted.rows[0] || {
      user_id: userId,
      likes_enabled: true,
      comments_enabled: true,
      follows_enabled: true,
      mentions_enabled: true,
      messages_enabled: true,
      trust_updates_enabled: true,
      system_enabled: true,
      push_enabled: true,
    };
  });

  fastify.patch('/settings', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const current = await pool.query('SELECT * FROM notification_preferences WHERE user_id = $1 LIMIT 1', [userId]);
    const source = current.rows[0] || {
      likes_enabled: true,
      comments_enabled: true,
      follows_enabled: true,
      mentions_enabled: true,
      messages_enabled: true,
      trust_updates_enabled: true,
      system_enabled: true,
      push_enabled: true,
    };

    const body = request.body || {};
    const next = {
      likes_enabled: typeof body.likes_enabled === 'boolean' ? body.likes_enabled : source.likes_enabled,
      comments_enabled: typeof body.comments_enabled === 'boolean' ? body.comments_enabled : source.comments_enabled,
      follows_enabled: typeof body.follows_enabled === 'boolean' ? body.follows_enabled : source.follows_enabled,
      mentions_enabled: typeof body.mentions_enabled === 'boolean' ? body.mentions_enabled : source.mentions_enabled,
      messages_enabled: typeof body.messages_enabled === 'boolean' ? body.messages_enabled : source.messages_enabled,
      trust_updates_enabled: typeof body.trust_updates_enabled === 'boolean' ? body.trust_updates_enabled : source.trust_updates_enabled,
      system_enabled: typeof body.system_enabled === 'boolean' ? body.system_enabled : source.system_enabled,
      push_enabled: typeof body.push_enabled === 'boolean' ? body.push_enabled : source.push_enabled,
    };

    const updated = await pool.query(
      `
      INSERT INTO notification_preferences (
        user_id,
        likes_enabled,
        comments_enabled,
        follows_enabled,
        mentions_enabled,
        messages_enabled,
        trust_updates_enabled,
        system_enabled,
        push_enabled,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE SET
        likes_enabled = EXCLUDED.likes_enabled,
        comments_enabled = EXCLUDED.comments_enabled,
        follows_enabled = EXCLUDED.follows_enabled,
        mentions_enabled = EXCLUDED.mentions_enabled,
        messages_enabled = EXCLUDED.messages_enabled,
        trust_updates_enabled = EXCLUDED.trust_updates_enabled,
        system_enabled = EXCLUDED.system_enabled,
        push_enabled = EXCLUDED.push_enabled,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [
        userId,
        next.likes_enabled,
        next.comments_enabled,
        next.follows_enabled,
        next.mentions_enabled,
        next.messages_enabled,
        next.trust_updates_enabled,
        next.system_enabled,
        next.push_enabled,
      ]
    );

    return updated.rows[0];
  });

  fastify.patch('/:notificationId/read', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const profileId = await getProfileId(userId);
    if (!profileId) return reply.status(404).send({ message: 'Notification not found' });

    const rows = await buildActivityRows(profileId, userId);
    const target = rows.find((row) => row.id === request.params.notificationId);
    if (!target) {
      return reply.status(404).send({ message: 'Notification not found' });
    }

    await pool.query(
      `
      INSERT INTO notification_reads (user_id, notification_type, source_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, notification_type, source_id) DO NOTHING
      `,
      [userId, target.type, target.id]
    );

    return { read: true };
  });

  fastify.patch('/read-all', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const profileId = await getProfileId(userId);
    if (!profileId) return { read: true };

    const rows = await buildActivityRows(profileId, userId);
    for (const row of rows) {
      await pool.query(
        `
        INSERT INTO notification_reads (user_id, notification_type, source_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, notification_type, source_id) DO NOTHING
        `,
        [userId, row.type, row.id]
      );
    }

    return { read: true };
  });

  fastify.get('/:notificationId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const profileId = await getProfileId(userId);
    if (!profileId) return reply.status(404).send({ message: 'Notification not found' });

    const rows = await buildActivityRows(profileId, userId);
    const row = rows.find((item) => item.id === request.params.notificationId);
    if (!row) {
      return reply.status(404).send({ message: 'Notification not found' });
    }

    return row;
  });
}

module.exports = notificationRoutes;
