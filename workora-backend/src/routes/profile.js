async function profileRoutes(fastify) {
  const { pool } = fastify;

  // 1. GET PROFILE
  fastify.get('/me/:userId', async (request, reply) => {
    const { userId } = request.params;
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (!userRes.rows[0]) return reply.status(404).send({ message: 'User not found' });

    const profileRes = await pool.query('SELECT * FROM worker_profiles WHERE user_id = $1', [userId]);
    const skillsRes = await pool.query(
      'SELECT * FROM worker_skills WHERE profile_id = $1', [profileRes.rows[0]?.id]
    );
    const langsRes = await pool.query(
      'SELECT * FROM worker_languages WHERE profile_id = $1', [profileRes.rows[0]?.id]
    );
    const expRes = await pool.query(
      'SELECT * FROM worker_experience WHERE profile_id = $1 ORDER BY start_date DESC', [profileRes.rows[0]?.id]
    );
    const eduRes = await pool.query(
      'SELECT * FROM worker_education WHERE profile_id = $1 ORDER BY end_year DESC', [profileRes.rows[0]?.id]
    );
    const certRes = await pool.query(
      'SELECT * FROM worker_certifications WHERE profile_id = $1', [profileRes.rows[0]?.id]
    );

    return {
      user: userRes.rows[0],
      profile: profileRes.rows[0] || null,
      skills: skillsRes.rows,
      languages: langsRes.rows,
      experience: expRes.rows,
      education: eduRes.rows,
      certifications: certRes.rows,
    };
  });

  // 2. UPDATE PROFILE (bio, title, display_name, location)
  fastify.patch('/update/:userId', async (request, reply) => {
    const { userId } = request.params;
    const { bio, title, display_name, location } = request.body;

    await pool.query(
      `UPDATE worker_profiles SET 
        bio = COALESCE($1, bio), 
        title = COALESCE($2, title), 
        display_name = COALESCE($3, display_name), 
        location = COALESCE($4, location),
        updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $5`,
      [bio, title, display_name, location, userId]
    );
    return { success: true };
  });

  // 3. ADD SKILL
  fastify.post('/skills', async (request, reply) => {
    const { profile_id, skill_name, skill_level } = request.body;
    const res = await pool.query(
      'INSERT INTO worker_skills (profile_id, skill_name, skill_level) VALUES ($1, $2, $3) RETURNING *',
      [profile_id, skill_name, skill_level || 'intermediate']
    );
    return res.rows[0];
  });

  // 4. DELETE SKILL
  fastify.delete('/skills/:id', async (request, reply) => {
    await pool.query('DELETE FROM worker_skills WHERE id = $1', [request.params.id]);
    return { success: true };
  });

  // 5. ADD LANGUAGE
  fastify.post('/languages', async (request, reply) => {
    const { profile_id, language, proficiency } = request.body;
    const res = await pool.query(
      'INSERT INTO worker_languages (profile_id, language, proficiency) VALUES ($1, $2, $3) RETURNING *',
      [profile_id, language, proficiency || 'conversational']
    );
    return res.rows[0];
  });

  // 6. DELETE LANGUAGE
  fastify.delete('/languages/:id', async (request, reply) => {
    await pool.query('DELETE FROM worker_languages WHERE id = $1', [request.params.id]);
    return { success: true };
  });

  // 7. ADD EXPERIENCE
  fastify.post('/experience', async (request, reply) => {
    const { profile_id, company, role_title, description, start_date, end_date, is_current } = request.body;
    const res = await pool.query(
      'INSERT INTO worker_experience (profile_id, company, role_title, description, start_date, end_date, is_current) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [profile_id, company, role_title, description, start_date, end_date, is_current || false]
    );
    return res.rows[0];
  });

  // 8. DELETE EXPERIENCE
  fastify.delete('/experience/:id', async (request, reply) => {
    await pool.query('DELETE FROM worker_experience WHERE id = $1', [request.params.id]);
    return { success: true };
  });

  // 9. ADD EDUCATION
  fastify.post('/education', async (request, reply) => {
    const { profile_id, institution, degree, field_of_study, start_year, end_year } = request.body;
    const res = await pool.query(
      'INSERT INTO worker_education (profile_id, institution, degree, field_of_study, start_year, end_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [profile_id, institution, degree, field_of_study, start_year, end_year]
    );
    return res.rows[0];
  });

  // 10. DELETE EDUCATION
  fastify.delete('/education/:id', async (request, reply) => {
    await pool.query('DELETE FROM worker_education WHERE id = $1', [request.params.id]);
    return { success: true };
  });

  // 11. ADD CERTIFICATION
  fastify.post('/certifications', async (request, reply) => {
    const { profile_id, cert_name, issuing_org, issue_date, expiry_date, credential_url } = request.body;
    const res = await pool.query(
      'INSERT INTO worker_certifications (profile_id, cert_name, issuing_org, issue_date, expiry_date, credential_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [profile_id, cert_name, issuing_org, issue_date, expiry_date, credential_url]
    );
    return res.rows[0];
  });

  // 12. DELETE CERTIFICATION
  fastify.delete('/certifications/:id', async (request, reply) => {
    await pool.query('DELETE FROM worker_certifications WHERE id = $1', [request.params.id]);
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
  fastify.post('/ratings', async (request, reply) => {
    const { gig_id, from_user_id, to_worker_id, score, comment } = request.body;
    
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

  // 15. SEARCH PROS
  fastify.get('/search', async (request, reply) => {
    const { q, category } = request.query;
    let sql = 'SELECT * FROM worker_profiles WHERE 1=1';
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      sql += ` AND (full_name ILIKE $${params.length} OR bio ILIKE $${params.length} OR trade ILIKE $${params.length})`;
    }

    if (category && category !== 'All' && category !== '') {
      params.push(category);
      sql += ` AND trade = $${params.length}`;
    }

    sql += ' ORDER BY trust_score DESC LIMIT 20';
    
    try {
      const res = await pool.query(sql, params);
      return res.rows;
    } catch (err) {
      console.error('Search query failed:', err);
      return reply.status(500).send({ error: 'Search failed' });
    }
  });
}

module.exports = profileRoutes;
