/**
 * Jobs — the hirer/business side of the platform.
 * Workers post proof-of-work (gigs); businesses post jobs and hire.
 */
async function jobRoutes(fastify) {
  const { pool } = fastify;

  /** Optional auth: return the user id if a valid token was sent. */
  const optionalUserId = async (request) => {
    try {
      await request.jwtVerify();
      return request.user?.id || null;
    } catch {
      return null;
    }
  };

  const JOB_SELECT = `
    SELECT
      j.*,
      u.username AS hirer_name,
      (SELECT COUNT(*)::int FROM job_applications ja WHERE ja.job_id = j.id) AS applications_count,
      $1::uuid IS NOT NULL
        AND EXISTS(
          SELECT 1 FROM job_applications ja2
          WHERE ja2.job_id = j.id AND ja2.worker_id = $1
        ) AS applied_by_me,
      $1::uuid IS NOT NULL AND j.hirer_id = $1 AS is_owner
    FROM job_posts j
    JOIN users u ON u.id = j.hirer_id
  `;

  // ── POST / — create a job post ──
  fastify.post('/', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    const body = request.body || {};
    const title = String(body.title || '').trim();

    if (!title) return reply.status(400).send({ message: 'Job title is required' });
    if (title.length > 140) return reply.status(400).send({ message: 'Title must be under 140 characters' });

    const res = await pool.query(
      `INSERT INTO job_posts (hirer_id, title, description, category, budget_min, budget_max, currency, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        title,
        body.description ? String(body.description) : null,
        body.category ? String(body.category) : null,
        body.budget_min ? Math.max(0, Number(body.budget_min)) : null,
        body.budget_max ? Math.max(0, Number(body.budget_max)) : null,
        body.currency || 'KSh',
        body.location ? String(body.location) : null,
      ]
    );
    return res.rows[0];
  });

  // ── GET / — browse open jobs ──
  fastify.get('/', async (request, reply) => {
    const userId = await optionalUserId(request);
    const res = await pool.query(
      `${JOB_SELECT}
       WHERE j.status = 'open'
       ORDER BY j.created_at DESC
       LIMIT 60`,
      [userId]
    );
    return res.rows;
  });

  // ── GET /mine — jobs I posted, with applications ──
  fastify.get('/mine', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    const jobsRes = await pool.query(
      `SELECT
         j.*,
         u.username AS hirer_name,
         (SELECT COUNT(*)::int FROM job_applications ja WHERE ja.job_id = j.id) AS applications_count,
         (SELECT COUNT(*)::int FROM job_applications ja WHERE ja.job_id = j.id AND ja.status = 'pending') AS pending_count
       FROM job_posts j
       JOIN users u ON u.id = j.hirer_id
       WHERE j.hirer_id = $1
       ORDER BY j.created_at DESC`,
      [userId]
    );
    const jobs = jobsRes.rows;

    // Applications for my jobs (flat, newest first)
    const appsRes = await pool.query(
      `SELECT
         ja.*,
         j.title AS job_title,
         j.budget_min, j.budget_max, j.currency,
         u.username AS worker_name,
         wp.trade AS worker_trade,
         wp.is_verified AS worker_verified,
         wp.trust_score AS worker_trust
       FROM job_applications ja
       JOIN job_posts j ON j.id = ja.job_id
       JOIN users u ON u.id = ja.worker_id
       LEFT JOIN worker_profiles wp ON wp.user_id = ja.worker_id
       WHERE j.hirer_id = $1
       ORDER BY ja.created_at DESC`,
      [userId]
    );

    return { jobs, applications: appsRes.rows };
  });

  // ── GET /my-applications — jobs I applied to ──
  fastify.get('/my-applications', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    const res = await pool.query(
      `SELECT
         ja.id AS application_id,
         ja.status AS application_status,
         ja.message,
         ja.created_at AS applied_at,
         j.*,
         u.username AS hirer_name
       FROM job_applications ja
       JOIN job_posts j ON j.id = ja.job_id
       JOIN users u ON u.id = j.hirer_id
       WHERE ja.worker_id = $1
       ORDER BY ja.created_at DESC`,
      [userId]
    );
    return res.rows;
  });

  // ── GET /:id — single job detail ──
  fastify.get('/:id', async (request, reply) => {
    const userId = await optionalUserId(request);
    const res = await pool.query(
      `${JOB_SELECT} WHERE j.id = $2`,
      [userId, request.params.id]
    );
    if (!res.rows[0]) return reply.status(404).send({ message: 'Job not found' });
    return res.rows[0];
  });

  // ── POST /:id/apply — apply to a job ──
  fastify.post('/:id/apply', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    const message = request.body?.message ? String(request.body.message).slice(0, 600) : null;

    const jobRes = await pool.query('SELECT * FROM job_posts WHERE id = $1', [request.params.id]);
    if (!jobRes.rows[0]) return reply.status(404).send({ message: 'Job not found' });
    const job = jobRes.rows[0];
    if (job.status !== 'open') return reply.status(400).send({ message: 'This job is no longer accepting applications' });
    if (job.hirer_id === userId) return reply.status(400).send({ message: 'You cannot apply to your own job' });

    const res = await pool.query(
      `INSERT INTO job_applications (job_id, worker_id, message)
       VALUES ($1, $2, $3)
       ON CONFLICT (job_id, worker_id) DO UPDATE SET message = EXCLUDED.message
       RETURNING *`,
      [request.params.id, userId, message]
    );
    return res.rows[0];
  });

  // ── PATCH /:id/status — close / reopen my job ──
  fastify.patch('/:id/status', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    const status = request.body?.status;
    if (status !== 'open' && status !== 'closed') {
      return reply.status(400).send({ message: 'Status must be open or closed' });
    }
    const res = await pool.query(
      `UPDATE job_posts SET status = $1 WHERE id = $2 AND hirer_id = $3 RETURNING *`,
      [status, request.params.id, userId]
    );
    if (!res.rows[0]) return reply.status(404).send({ message: 'Job not found' });
    return res.rows[0];
  });

  // ── PATCH /:jobId/applications/:applicationId — accept / reject ──
  fastify.patch('/:jobId/applications/:applicationId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    const status = request.body?.status;
    if (status !== 'accepted' && status !== 'rejected' && status !== 'pending') {
      return reply.status(400).send({ message: 'Status must be accepted, rejected or pending' });
    }
    const res = await pool.query(
      `UPDATE job_applications ja
       SET status = $1
       FROM job_posts j
       WHERE ja.id = $2 AND ja.job_id = $3 AND j.id = $3 AND j.hirer_id = $4
       RETURNING ja.*`,
      [status, request.params.applicationId, request.params.jobId, userId]
    );
    if (!res.rows[0]) return reply.status(404).send({ message: 'Application not found' });
    return res.rows[0];
  });
}

module.exports = jobRoutes;
