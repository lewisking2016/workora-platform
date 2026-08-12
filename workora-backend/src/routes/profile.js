async function profileRoutes(fastify) {
  const { pool } = fastify;
  const getOwnedProfileId = async (userId) => {
    const profileRes = await pool.query('SELECT id FROM worker_profiles WHERE user_id = $1', [userId]);
    return profileRes.rows[0]?.id || null;
  };

  const resolveActorId = (request) => request.user?.id;
  const loadProfileBundle = async (userId) => {
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const profileRes = await pool.query('SELECT * FROM worker_profiles WHERE user_id = $1', [userId]);
    const profile = profileRes.rows[0] || null;
    const profileId = profile?.id || null;
    const accountStatus = String(profile?.account_status || 'active');
    const profileVisibility = String(profile?.profile_visibility || 'public');
    const rawVerification = String(profile?.verification_status || profile?.identity_status || 'pending');
    const verificationStatus =
      profile?.is_verified || rawVerification === 'verified' || rawVerification === 'complete'
        ? 'verified'
        : rawVerification;
    const isEmptyProfile =
      profile &&
      !profile.bio &&
      !profile.avatar_url &&
      !profile.cover_url &&
      !profile.pricing_from &&
      !profile.service_areas;
    const profileState = !userRes.rows[0]
      ? 'not_found'
      : accountStatus === 'suspended'
        ? 'suspended'
        : profileVisibility === 'restricted'
          ? 'restricted'
          : profileVisibility === 'private'
            ? 'private'
            : verificationStatus === 'pending'
              ? 'verification_pending'
              : isEmptyProfile
                ? 'empty'
                : 'ready';

    const emptyLists = {
      skills: [],
      languages: [],
      experience: [],
      education: [],
      certifications: [],
      portfolio: [],
      ratings: [],
      ratingBreakdown: [],
      trustAverage: 0,
      totalEarnings: 0,
    };

    if (!profileId) {
      return {
        user: userRes.rows[0] || null,
        profile: null,
        profile_state: 'not_found',
        social: { followers: 0, following: 0 },
        reliability: { score: 0, ratingAverage: 0, worksCount: 0, engagement: 0 },
        ...emptyLists,
      };
    }

    const [
      skillsRes,
      langsRes,
      expRes,
      eduRes,
      certRes,
      portfolioRes,
      ratingsRes,
      breakdownRes,
      avgRes,
      earningsRes,
      followersRes,
      followingRes,
    ] = await Promise.all([
      pool.query('SELECT * FROM worker_skills WHERE profile_id = $1 ORDER BY created_at DESC', [profileId]),
      pool.query('SELECT * FROM worker_languages WHERE profile_id = $1 ORDER BY created_at DESC', [profileId]),
      pool.query('SELECT * FROM worker_experience WHERE profile_id = $1 ORDER BY start_date DESC NULLS LAST, created_at DESC', [profileId]),
      pool.query('SELECT * FROM worker_education WHERE profile_id = $1 ORDER BY end_year DESC NULLS LAST, created_at DESC', [profileId]),
      pool.query('SELECT * FROM worker_certifications WHERE profile_id = $1 ORDER BY created_at DESC', [profileId]),
      pool.query(
        `SELECT
          g.*,
          COALESCE(g.thumbnail_url, g.video_url) AS preview_url
         FROM gigs g
         WHERE g.worker_id = $1
         ORDER BY g.created_at DESC
         LIMIT 12`,
        [profileId]
      ),
      pool.query(
        `SELECT
          r.*,
          u.username AS reviewer_username
         FROM ratings r
         LEFT JOIN users u ON u.id = r.from_user_id
         WHERE r.to_worker_id = $1
         ORDER BY r.created_at DESC
         LIMIT 24`,
        [profileId]
      ),
      pool.query(
        `SELECT score, COUNT(*)::int AS count
         FROM ratings
         WHERE to_worker_id = $1
         GROUP BY score`,
        [profileId]
      ),
      pool.query(
        `SELECT COALESCE(AVG(score), 0) AS average
         FROM ratings
         WHERE to_worker_id = $1`,
        [profileId]
      ),
      pool.query(
        `SELECT COALESCE(SUM(COALESCE(price, 0)), 0) AS total_earnings
         FROM gigs WHERE worker_id = $1`,
        [profileId]
      ).catch(async () => ({
        // Older DBs may not have gigs.price yet
        rows: [{ total_earnings: 0 }],
      })),
      pool.query('SELECT COUNT(*)::int AS count FROM user_follows WHERE following_user_id = $1', [userId]),
      pool.query('SELECT COUNT(*)::int AS count FROM user_follows WHERE follower_id = $1', [userId]),
    ]);

    // ── Reliability: honest score from real signals, never fabricated ──
    const ratingAvg = Number(avgRes.rows[0]?.average || 0);
    const worksCount = portfolioRes.rows.length;
    const completeness =
      [profile.bio, profile.avatar_url, profile.cover_url, profile.service_areas, profile.pricing_from]
        .filter(Boolean).length / 5;
    const engagement = portfolioRes.rows.reduce(
      (sum, g) => sum + Number(g.view_count || 0) + Number(g.likes_count || 0) + Number(g.comments_count || 0),
      0
    );
    const reliabilityScore = Math.min(
      100,
      Math.round(
        ratingAvg * 14 +                        // ratings quality → up to 70
        completeness * 15 +                     // profile completeness → up to 15
        Math.min(1, worksCount / 6) * 10 +      // proof-of-work volume → up to 10
        Math.min(1, engagement / 300) * 5       // audience trust → up to 5
      )
    );

    return {
      user: userRes.rows[0] || null,
      profile: profile
        ? {
            ...profile,
            total_earnings: Number(earningsRes.rows[0]?.total_earnings || 0),
          }
        : null,
      profile_state: profileState,
      social: {
        followers: Number(followersRes.rows[0]?.count || 0),
        following: Number(followingRes.rows[0]?.count || 0),
      },
      reliability: {
        score: reliabilityScore,
        ratingAverage: Number(ratingAvg.toFixed(1)),
        worksCount,
        engagement,
      },
      skills: skillsRes.rows,
      languages: langsRes.rows,
      experience: expRes.rows,
      education: eduRes.rows,
      certifications: certRes.rows,
      portfolio: portfolioRes.rows,
      ratings: ratingsRes.rows,
      ratingBreakdown: breakdownRes.rows,
      trustAverage: Number(avgRes.rows[0]?.average || 0),
      totalEarnings: Number(earningsRes.rows[0]?.total_earnings || 0),
    };
  };

  // 1. GET PROFILE
  fastify.get('/me', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' });
    return loadProfileBundle(userId);
  });

  fastify.get('/me/:userId', async (request, reply) => {
    const { userId } = request.params;
    const bundle = await loadProfileBundle(userId);
    if (!bundle.user) return reply.status(404).send({ message: 'User not found' });
    return bundle;
  });

  fastify.get('/public/:userId', async (request, reply) => {
    const { userId } = request.params;
    const bundle = await loadProfileBundle(userId);
    if (!bundle.user) return reply.status(404).send({ message: 'User not found' });
    return bundle;
  });

  // 2. UPDATE PROFILE (bio, title, display_name, location)
  fastify.patch('/update/:userId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { userId } = request.params;
    if (request.user?.id && request.user.id !== userId) {
      return reply.status(403).send({ message: 'Forbidden' });
    }
    const {
      bio,
      title,
      display_name,
      location,
      availability_status,
      service_areas,
      pricing_from,
      cover_url,
      identity_status,
      identity_document_url,
    } = request.body;

    await pool.query(
      `UPDATE worker_profiles SET 
        bio = COALESCE($1, bio), 
        title = COALESCE($2, title), 
        display_name = COALESCE($3, display_name), 
        location = COALESCE($4, location),
        availability_status = COALESCE($5, availability_status),
        service_areas = COALESCE($6, service_areas),
        pricing_from = COALESCE($7, pricing_from),
        cover_url = COALESCE($8, cover_url),
        identity_status = COALESCE($9, identity_status),
        identity_document_url = COALESCE($10, identity_document_url),
        updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $11`,
      [
        bio,
        title,
        display_name,
        location,
        availability_status,
        service_areas,
        pricing_from,
        cover_url,
        identity_status,
        identity_document_url,
        userId,
      ]
    );
    return { success: true };
  });

  // 3. ADD SKILL
  fastify.post('/skills', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { skill_name, skill_level } = request.body;
    const profile_id = await getOwnedProfileId(request.user.id);
    if (!profile_id) return reply.status(404).send({ message: 'Profile not found' });
    const res = await pool.query(
      'INSERT INTO worker_skills (profile_id, skill_name, skill_level) VALUES ($1, $2, $3) RETURNING *',
      [profile_id, skill_name, skill_level || 'intermediate']
    );
    return res.rows[0];
  });

  // 4. DELETE SKILL
  fastify.delete('/skills/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const profile_id = await getOwnedProfileId(request.user.id);
    await pool.query('DELETE FROM worker_skills WHERE id = $1 AND profile_id = $2', [request.params.id, profile_id]);
    return { success: true };
  });

  // 5. ADD LANGUAGE
  fastify.post('/languages', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { language, proficiency } = request.body;
    const profile_id = await getOwnedProfileId(request.user.id);
    if (!profile_id) return reply.status(404).send({ message: 'Profile not found' });
    const res = await pool.query(
      'INSERT INTO worker_languages (profile_id, language, proficiency) VALUES ($1, $2, $3) RETURNING *',
      [profile_id, language, proficiency || 'conversational']
    );
    return res.rows[0];
  });

  // 6. DELETE LANGUAGE
  fastify.delete('/languages/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const profile_id = await getOwnedProfileId(request.user.id);
    await pool.query('DELETE FROM worker_languages WHERE id = $1 AND profile_id = $2', [request.params.id, profile_id]);
    return { success: true };
  });

  // 7. ADD EXPERIENCE
  fastify.post('/experience', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { company, role_title, description, start_date, end_date, is_current } = request.body;
    const profile_id = await getOwnedProfileId(request.user.id);
    if (!profile_id) return reply.status(404).send({ message: 'Profile not found' });
    const res = await pool.query(
      'INSERT INTO worker_experience (profile_id, company, role_title, description, start_date, end_date, is_current) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [profile_id, company, role_title, description, start_date, end_date, is_current || false]
    );
    return res.rows[0];
  });

  // 8. DELETE EXPERIENCE
  fastify.delete('/experience/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const profile_id = await getOwnedProfileId(request.user.id);
    await pool.query('DELETE FROM worker_experience WHERE id = $1 AND profile_id = $2', [request.params.id, profile_id]);
    return { success: true };
  });

  // 9. ADD EDUCATION
  fastify.post('/education', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { institution, degree, field_of_study, start_year, end_year } = request.body;
    const profile_id = await getOwnedProfileId(request.user.id);
    if (!profile_id) return reply.status(404).send({ message: 'Profile not found' });
    const res = await pool.query(
      'INSERT INTO worker_education (profile_id, institution, degree, field_of_study, start_year, end_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [profile_id, institution, degree, field_of_study, start_year, end_year]
    );
    return res.rows[0];
  });

  // 10. DELETE EDUCATION
  fastify.delete('/education/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const profile_id = await getOwnedProfileId(request.user.id);
    await pool.query('DELETE FROM worker_education WHERE id = $1 AND profile_id = $2', [request.params.id, profile_id]);
    return { success: true };
  });

  // 11. ADD CERTIFICATION
  fastify.post('/certifications', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { cert_name, issuing_org, issue_date, expiry_date, credential_url } = request.body;
    const profile_id = await getOwnedProfileId(request.user.id);
    if (!profile_id) return reply.status(404).send({ message: 'Profile not found' });
    const res = await pool.query(
      'INSERT INTO worker_certifications (profile_id, cert_name, issuing_org, issue_date, expiry_date, credential_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [profile_id, cert_name, issuing_org, issue_date, expiry_date, credential_url]
    );
    return res.rows[0];
  });

  // 12. DELETE CERTIFICATION
  fastify.delete('/certifications/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const profile_id = await getOwnedProfileId(request.user.id);
    await pool.query('DELETE FROM worker_certifications WHERE id = $1 AND profile_id = $2', [request.params.id, profile_id]);
    return { success: true };
  });

  // 13. GET RATINGS & BREAKDOWN (Uber-style)
  fastify.get('/ratings/:profileId', async (request, reply) => {
    const { profileId } = request.params;
    
    // Get all ratings
    const ratingsRes = await pool.query(`
      SELECT r.*, u.username, u.role
      FROM ratings r
      JOIN users u ON r.from_user_id = u.id
      WHERE r.to_worker_id = $1
      ORDER BY r.created_at DESC
    `, [profileId]);

    // Calculate Breakdown
    const breakdownRes = await pool.query(`
      SELECT 
        score,
        COUNT(*) as count
      FROM ratings
      WHERE to_worker_id = $1
      GROUP BY score
    `, [profileId]);

    // Calculate Average
    const avgRes = await pool.query(`
      SELECT AVG(score) as average
      FROM ratings
      WHERE to_worker_id = $1
    `, [profileId]);

    return {
      ratings: ratingsRes.rows,
      breakdown: breakdownRes.rows,
      average: parseFloat(avgRes.rows[0].average || 0).toFixed(1)
    };
  });

  // 14. POST RATING
  fastify.post('/ratings', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { gig_id, to_worker_id, score, comment } = request.body;
    const from_user_id = request.user.id;
    
    const res = await pool.query(
      'INSERT INTO ratings (gig_id, from_user_id, to_worker_id, score, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [gig_id, from_user_id, to_worker_id, score, comment]
    );

    // Update worker_profiles trust_score (Weighted Moving Average logic can be complex, for now simple avg)
    await pool.query(`
      UPDATE worker_profiles
      SET trust_score = (SELECT AVG(score) FROM ratings WHERE to_worker_id = $1)
      WHERE id = $1
    `, [to_worker_id]);

    return res.rows[0];
  });

  // 14b. UPDATE RATING
  fastify.put('/ratings/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const { score, comment } = request.body;
    const from_user_id = request.user.id;

    const existing = await pool.query('SELECT id, from_user_id, to_worker_id FROM ratings WHERE id = $1', [id]);
    const rating = existing.rows[0];
    if (!rating) return reply.status(404).send({ message: 'Review not found' });
    if (rating.from_user_id !== from_user_id) return reply.status(403).send({ message: 'Forbidden' });

    const res = await pool.query(
      'UPDATE ratings SET score = COALESCE($1, score), comment = COALESCE($2, comment) WHERE id = $3 RETURNING *',
      [score, comment, id]
    );

    await pool.query(`
      UPDATE worker_profiles
      SET trust_score = (SELECT COALESCE(AVG(score), 0) FROM ratings WHERE to_worker_id = $1)
      WHERE id = $1
    `, [rating.to_worker_id]);

    return res.rows[0];
  });

  // 14c. DELETE RATING
  fastify.delete('/ratings/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const from_user_id = request.user.id;

    const existing = await pool.query('SELECT id, from_user_id, to_worker_id FROM ratings WHERE id = $1', [id]);
    const rating = existing.rows[0];
    if (!rating) return reply.status(404).send({ message: 'Review not found' });
    if (rating.from_user_id !== from_user_id) return reply.status(403).send({ message: 'Forbidden' });

    await pool.query('DELETE FROM ratings WHERE id = $1', [id]);

    await pool.query(`
      UPDATE worker_profiles
      SET trust_score = (SELECT COALESCE(AVG(score), 0) FROM ratings WHERE to_worker_id = $1)
      WHERE id = $1
    `, [rating.to_worker_id]);

    return { deleted: true };
  });

  // 15. SEARCH PROS
  fastify.get('/search', async (request, reply) => {
    const {
      q,
      category,
      location,
      availability,
      sort,
      min_trust,
    } = request.query;
    let sql = `
      SELECT 
        p.*,
        u.id as user_id,
        COALESCE(p.full_name, u.username) as user_name,
        COALESCE(p.location, 'Kenya') as location,
        COALESCE(p.availability_status, 'available') as availability_status
      FROM worker_profiles p
      JOIN users u ON u.id = p.user_id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      sql += ` AND (full_name ILIKE $${params.length} OR bio ILIKE $${params.length} OR trade ILIKE $${params.length})`;
    }

    if (category && category !== 'All' && category !== '') {
      params.push(category);
      // Case-insensitive so URL paths like /categories/electrician match
      // the canonical 'Electrician' trade casing stored in the DB.
      sql += ` AND LOWER(trade) = LOWER($${params.length})`;
    }

    if (location && location !== 'All' && location !== '') {
      params.push(`%${location}%`);
      sql += ` AND COALESCE(location, 'Kenya') ILIKE $${params.length}`;
    }

    if (availability && availability !== 'All' && availability !== '') {
      params.push(availability);
      sql += ` AND COALESCE(availability_status, 'available') = $${params.length}`;
    }

    if (min_trust && !Number.isNaN(Number(min_trust))) {
      params.push(Number(min_trust));
      sql += ` AND COALESCE(trust_score, 0) >= $${params.length}`;
    }

    const orderBy = {
      trust: 'COALESCE(p.trust_score, 0) DESC, COALESCE(p.created_at, NOW()) DESC',
      location: 'COALESCE(p.location, \'Kenya\') ASC, COALESCE(p.trust_score, 0) DESC',
      recent: 'COALESCE(p.created_at, NOW()) DESC',
      availability: 'COALESCE(p.availability_status, \'available\') ASC, COALESCE(p.trust_score, 0) DESC',
    }[String(sort || 'trust')] || 'COALESCE(p.trust_score, 0) DESC';

    sql += ` ORDER BY ${orderBy} LIMIT 20`;
    
    try {
      const res = await pool.query(sql, params);
      return res.rows;
    } catch (err) {
      console.error('Search query failed:', err);
      // Fallback: minimal search without optional columns
      try {
        const fallback = await pool.query(
          `SELECT p.*, u.id as user_id,
                  COALESCE(p.full_name, u.username) as user_name,
                  COALESCE(p.location, 'Kenya') as location,
                  'available' as availability_status
           FROM worker_profiles p
           JOIN users u ON u.id = p.user_id
           ORDER BY COALESCE(p.trust_score, 0) DESC
           LIMIT 20`
        );
        return fallback.rows;
      } catch (fallbackErr) {
        console.error('Search fallback failed:', fallbackErr);
        return reply.status(500).send({ error: 'Search failed' });
      }
    }
  });

  // 16. GET UNIQUE TRADES (CATEGORIES)
  fastify.get('/trades', async (request, reply) => {
    try {
      const res = await pool.query('SELECT DISTINCT trade FROM worker_profiles WHERE trade IS NOT NULL ORDER BY trade');
      return res.rows.map(row => row.trade);
    } catch (err) {
      console.error('Trades query failed:', err);
      return reply.status(500).send({ error: 'Failed to fetch trades' });
    }
  });

  // 17. TOGGLE FOLLOW
  fastify.post('/follow/:targetUserId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const followerId = resolveActorId(request);
    const { targetUserId } = request.params;

    if (!followerId || followerId === targetUserId) {
      return reply.status(400).send({ message: 'Invalid follow target' });
    }

    const existing = await pool.query(
      'SELECT id FROM user_follows WHERE follower_id = $1 AND following_user_id = $2',
      [followerId, targetUserId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM user_follows WHERE follower_id = $1 AND following_user_id = $2', [followerId, targetUserId]);
      return { following: false };
    }

    await pool.query(
      'INSERT INTO user_follows (follower_id, following_user_id) VALUES ($1, $2)',
      [followerId, targetUserId]
    );
    return { following: true };
  });

  // 18. TOGGLE MUTE CREATOR
  fastify.post('/mute/:targetUserId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const { targetUserId } = request.params;

    if (!userId || userId === targetUserId) {
      return reply.status(400).send({ message: 'Invalid mute target' });
    }

    const existing = await pool.query(
      'SELECT id FROM user_mutes WHERE user_id = $1 AND muted_user_id = $2',
      [userId, targetUserId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM user_mutes WHERE user_id = $1 AND muted_user_id = $2', [userId, targetUserId]);
      return { muted: false };
    }

    await pool.query(
      'INSERT INTO user_mutes (user_id, muted_user_id) VALUES ($1, $2)',
      [userId, targetUserId]
    );
    return { muted: true };
  });

  // 19. TOGGLE BLOCK CREATOR
  fastify.post('/block/:targetUserId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const blockerId = resolveActorId(request);
    const { targetUserId } = request.params;

    if (!blockerId || blockerId === targetUserId) {
      return reply.status(400).send({ message: 'Invalid block target' });
    }

    const existing = await pool.query(
      'SELECT id FROM user_blocks WHERE blocker_id = $1 AND blocked_user_id = $2',
      [blockerId, targetUserId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM user_blocks WHERE blocker_id = $1 AND blocked_user_id = $2', [blockerId, targetUserId]);
      return { blocked: false };
    }

    await pool.query(
      'INSERT INTO user_blocks (blocker_id, blocked_user_id) VALUES ($1, $2)',
      [blockerId, targetUserId]
    );
    return { blocked: true };
  });

  // 20. REPORT PROFILE
  fastify.post('/report/:targetUserId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const reporterUserId = resolveActorId(request);
    const { targetUserId } = request.params;
    const reason = String(request.body?.reason || 'other');
    const details = String(request.body?.details || '');

    const res = await pool.query(
      'INSERT INTO profile_reports (reporter_user_id, reported_user_id, reason, details) VALUES ($1, $2, $3, $4) RETURNING id',
      [reporterUserId, targetUserId, reason, details || null]
    );

    return { reported: true, report_id: res.rows[0]?.id };
  });

  // 21. FEATURED BUSINESSES
  fastify.get('/businesses', async (request, reply) => {
    const res = await pool.query(`
      SELECT
        u.id as user_id,
        COALESCE(wp.display_name, wp.full_name, u.username, 'Business') as business_name,
        COALESCE(wp.trade, u.role, 'Business') as category,
        COALESCE(wp.location, 'Kenya') as location,
        COALESCE(wp.trust_score, 0) as trust_score,
        COALESCE(wp.is_verified, false) as verified,
        COALESCE(wp.avatar_url, '') as avatar_url,
        COALESCE(wp.cover_url, '') as cover_url,
        COALESCE(wp.bio, '') as bio,
        COALESCE(wp.pricing_from, 0) as pricing_from,
        COUNT(g.id)::int as gig_count
      FROM users u
      LEFT JOIN worker_profiles wp ON wp.user_id = u.id
      LEFT JOIN gigs g ON g.worker_id = wp.id
      WHERE u.role = 'hirer'
         OR COALESCE(u.team_type, 'solo') = 'team'
         OR COALESCE(u.subscription, 'free') = 'elite'
      GROUP BY u.id, wp.display_name, wp.full_name, u.username, wp.trade, u.role, wp.location, wp.trust_score, wp.is_verified, wp.avatar_url, wp.cover_url, wp.bio, wp.pricing_from
      ORDER BY COALESCE(wp.trust_score, 0) DESC, gig_count DESC, business_name ASC
      LIMIT 24
    `);

    return res.rows;
  });

  // 22. COLLECTIONS
  fastify.get('/collections', async (request, reply) => {
    const ownerId = request.user?.id || null;
    const kind = String(request.query?.kind || '').trim().toLowerCase();
    if (kind === 'saved') {
      const savedRes = await pool.query(`
        SELECT
          c.*,
          COUNT(ci.id)::int AS item_count,
          COUNT(cs.id)::int AS save_count
        FROM collections c
        INNER JOIN collection_saves s ON s.collection_id = c.id
        LEFT JOIN collection_items ci ON ci.collection_id = c.id
        LEFT JOIN collection_saves cs ON cs.collection_id = c.id
        WHERE s.user_id = $1
        GROUP BY c.id
        ORDER BY s.created_at DESC
      `, [ownerId]);
      return savedRes.rows;
    }

    const res = await pool.query(`
      SELECT
        c.*,
        COUNT(ci.id)::int AS item_count,
        COUNT(cs.id)::int AS save_count
      FROM collections c
      LEFT JOIN collection_items ci ON ci.collection_id = c.id
      LEFT JOIN collection_saves cs ON cs.collection_id = c.id
      WHERE c.is_public = TRUE OR c.owner_user_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [ownerId]);
    return res.rows;
  });

  fastify.get('/collections/:collectionId', async (request, reply) => {
    const { collectionId } = request.params;
    const res = await pool.query(`
      SELECT
        c.*,
        json_agg(
          json_build_object(
            'id', ci.id,
            'item_type', ci.item_type,
            'gig_id', ci.gig_id,
            'profile_id', ci.profile_id,
            'position', ci.position,
            'gig_title', g.title,
            'gig_description', g.description,
            'gig_thumbnail_url', g.thumbnail_url,
            'gig_video_url', g.video_url,
            'profile_full_name', wp.full_name,
            'profile_display_name', wp.display_name,
            'profile_avatar_url', wp.avatar_url,
            'profile_trade', wp.trade,
            'profile_location', wp.location
          ) ORDER BY ci.position ASC, ci.created_at ASC
        ) FILTER (WHERE ci.id IS NOT NULL) AS items
      FROM collections c
      LEFT JOIN collection_items ci ON ci.collection_id = c.id
      LEFT JOIN gigs g ON g.id = ci.gig_id
      LEFT JOIN worker_profiles wp ON wp.id = ci.profile_id
      WHERE c.id = $1
      GROUP BY c.id
      LIMIT 1
    `, [collectionId]);

    if (!res.rows[0]) return reply.status(404).send({ message: 'Collection not found' });
    return res.rows[0];
  });

  fastify.post('/collections', { preHandler: fastify.authenticate }, async (request, reply) => {
    const ownerId = resolveActorId(request);
    const title = String(request.body?.title || '').trim();
    const description = String(request.body?.description || '').trim();
    const kind = String(request.body?.kind || 'custom').trim();
    const isPublic = request.body?.is_public !== false;
    const coverUrl = String(request.body?.cover_url || '').trim() || null;

    if (!title) return reply.status(400).send({ message: 'Title is required' });

    const res = await pool.query(
      'INSERT INTO collections (owner_user_id, title, description, kind, is_public, cover_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [ownerId, title, description || null, kind, isPublic, coverUrl]
    );

    return res.rows[0];
  });

  fastify.post('/collections/:collectionId/items', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { collectionId } = request.params;
    const { item_type, gig_id, profile_id, position } = request.body || {};
    const ownerId = resolveActorId(request);

    const collectionRes = await pool.query('SELECT owner_user_id FROM collections WHERE id = $1', [collectionId]);
    const collection = collectionRes.rows[0];
    if (!collection) return reply.status(404).send({ message: 'Collection not found' });
    if (collection.owner_user_id !== ownerId) return reply.status(403).send({ message: 'Forbidden' });

    const res = await pool.query(
      'INSERT INTO collection_items (collection_id, item_type, gig_id, profile_id, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [collectionId, item_type, gig_id || null, profile_id || null, Number(position || 0)]
    );

    return res.rows[0];
  });

  fastify.delete('/collections/:collectionId/items/:itemId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { collectionId, itemId } = request.params;
    const ownerId = resolveActorId(request);

    const collectionRes = await pool.query('SELECT owner_user_id FROM collections WHERE id = $1', [collectionId]);
    const collection = collectionRes.rows[0];
    if (!collection) return reply.status(404).send({ message: 'Collection not found' });
    if (collection.owner_user_id !== ownerId) return reply.status(403).send({ message: 'Forbidden' });

    await pool.query('DELETE FROM collection_items WHERE id = $1 AND collection_id = $2', [itemId, collectionId]);
    return { deleted: true };
  });

  fastify.post('/collections/:collectionId/save', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { collectionId } = request.params;
    const userId = resolveActorId(request);

    await pool.query(
      'INSERT INTO collection_saves (collection_id, user_id) VALUES ($1, $2) ON CONFLICT (collection_id, user_id) DO NOTHING',
      [collectionId, userId]
    );
    return { saved: true };
  });

  fastify.delete('/collections/:collectionId/save', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { collectionId } = request.params;
    const userId = resolveActorId(request);
    await pool.query('DELETE FROM collection_saves WHERE collection_id = $1 AND user_id = $2', [collectionId, userId]);
    return { saved: false };
  });

  // 23. DRAFTS
  fastify.get('/drafts', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const res = await pool.query(
      `SELECT *
       FROM post_drafts
       WHERE owner_user_id = $1
       ORDER BY updated_at DESC, created_at DESC`,
      [userId]
    );
    return res.rows;
  });

  fastify.get('/drafts/:draftId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { draftId } = request.params;
    const userId = resolveActorId(request);
    const res = await pool.query(
      `SELECT *
       FROM post_drafts
       WHERE id = $1 AND owner_user_id = $2
       LIMIT 1`,
      [draftId, userId]
    );

    if (!res.rows[0]) return reply.status(404).send({ message: 'Draft not found' });
    return res.rows[0];
  });

  fastify.post('/drafts', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const {
      draft_type,
      title,
      description,
      media_url,
      thumbnail_url,
      trade,
      location,
      audience,
      status,
      metadata,
    } = request.body || {};

    if (!draft_type) return reply.status(400).send({ message: 'draft_type is required' });

    const res = await pool.query(
      `INSERT INTO post_drafts (
        owner_user_id,
        draft_type,
        title,
        description,
        media_url,
        thumbnail_url,
        trade,
        location,
        audience,
        status,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'public'), COALESCE($10, 'draft'), COALESCE($11, '{}'::jsonb))
      RETURNING *`,
      [
        userId,
        draft_type,
        title || null,
        description || null,
        media_url || null,
        thumbnail_url || null,
        trade || null,
        location || null,
        audience || 'public',
        status || 'draft',
        metadata || {},
      ]
    );

    return res.rows[0];
  });

  fastify.patch('/drafts/:draftId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { draftId } = request.params;
    const userId = resolveActorId(request);
    const existing = await pool.query('SELECT id FROM post_drafts WHERE id = $1 AND owner_user_id = $2', [draftId, userId]);
    if (!existing.rows[0]) return reply.status(404).send({ message: 'Draft not found' });

    const {
      title,
      description,
      media_url,
      thumbnail_url,
      trade,
      location,
      audience,
      status,
      metadata,
    } = request.body || {};

    const res = await pool.query(
      `UPDATE post_drafts
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           media_url = COALESCE($3, media_url),
           thumbnail_url = COALESCE($4, thumbnail_url),
           trade = COALESCE($5, trade),
           location = COALESCE($6, location),
           audience = COALESCE($7, audience),
           status = COALESCE($8, status),
           metadata = COALESCE($9, metadata),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND owner_user_id = $11
       RETURNING *`,
      [title || null, description || null, media_url || null, thumbnail_url || null, trade || null, location || null, audience || null, status || null, metadata || null, draftId, userId]
    );

    return res.rows[0];
  });

  fastify.delete('/drafts/:draftId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { draftId } = request.params;
    const userId = resolveActorId(request);
    await pool.query('DELETE FROM post_drafts WHERE id = $1 AND owner_user_id = $2', [draftId, userId]);
    return { deleted: true };
  });

  // 24. SAVED PROFILES
  fastify.get('/saved/profiles', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const res = await pool.query(
      `SELECT
         sp.id,
         sp.created_at,
         wp.id AS profile_id,
         wp.full_name,
         wp.display_name,
         wp.trade,
         wp.location,
         wp.avatar_url,
         wp.is_verified,
         wp.trust_score,
         u.username
       FROM saved_profiles sp
       JOIN worker_profiles wp ON wp.id = sp.profile_id
       LEFT JOIN users u ON u.id = wp.user_id
       WHERE sp.user_id = $1
       ORDER BY sp.created_at DESC`,
      [userId]
    );
    return res.rows;
  });

  fastify.post('/saved/profiles', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const profileId = String(request.body?.profile_id || '').trim();
    if (!profileId) return reply.status(400).send({ message: 'profile_id is required' });

    const res = await pool.query(
      `INSERT INTO saved_profiles (user_id, profile_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, profile_id) DO UPDATE SET created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, profileId]
    );
    return res.rows[0];
  });

  fastify.delete('/saved/profiles/:profileId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const { profileId } = request.params;
    await pool.query('DELETE FROM saved_profiles WHERE user_id = $1 AND profile_id = $2', [userId, profileId]);
    return { saved: false };
  });

  // 25. SAVED SEARCHES
  fastify.get('/saved/searches', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const res = await pool.query(
      `SELECT *
       FROM saved_searches
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return res.rows;
  });

  fastify.post('/saved/searches', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const query = String(request.body?.query || '').trim();
    if (!query) return reply.status(400).send({ message: 'query is required' });
    const filters = request.body?.filters && typeof request.body.filters === 'object' ? request.body.filters : {};

    const res = await pool.query(
      `INSERT INTO saved_searches (user_id, query, filters)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, query) DO UPDATE SET filters = EXCLUDED.filters, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, query, filters]
    );
    return res.rows[0];
  });

  fastify.delete('/saved/searches/:searchId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const { searchId } = request.params;
    await pool.query('DELETE FROM saved_searches WHERE id = $1 AND user_id = $2', [searchId, userId]);
    return { saved: false };
  });
}

module.exports = profileRoutes;
