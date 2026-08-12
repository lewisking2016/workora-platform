const { z } = require('zod');

const analyticsSchema = z.object({
  event_name: z.string().min(2).max(64),
  session_id: z.string().min(6).max(128),
  page_path: z.string().min(1).max(255),
  screen_name: z.string().max(120).optional(),
  section: z.string().max(120).optional(),
  element: z.string().max(120).optional(),
  referrer: z.string().max(255).optional(),
  properties: z.record(z.any()).optional(),
});

const cleanString = (value, max = 255) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
};

const normalizeJsonValue = (value, depth = 0) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value.slice(0, 500);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    if (depth >= 3) return [];
    return value.slice(0, 10).map((item) => normalizeJsonValue(item, depth + 1));
  }
  if (typeof value === 'object') {
    if (depth >= 3) return {};

    const output = {};
    for (const [key, child] of Object.entries(value)) {
      if (child === undefined) continue;
      output[key.slice(0, 120)] = normalizeJsonValue(child, depth + 1);
    }
    return output;
  }
  return null;
};

const normalizeProperties = (props) => {
  if (!props || typeof props !== 'object' || Array.isArray(props)) return {};

  const normalized = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) continue;
    normalized[key.slice(0, 120)] = normalizeJsonValue(value);
  }

  return normalized;
};

async function analyticsRoutes(fastify) {
  const { pool } = fastify;

  fastify.post('/events', async (request, reply) => {
    const parsed = analyticsSchema.safeParse(request.body || {});
    if (!parsed.success) {
      return reply.status(400).send({ message: 'Invalid analytics payload' });
    }

    let userId = null;
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        await request.jwtVerify();
        userId = request.user?.id || null;
      } catch {
        userId = null;
      }
    }

    const payload = parsed.data;
    const eventName = cleanString(payload.event_name, 64);
    const sessionId = cleanString(payload.session_id, 128);
    const pagePath = cleanString(payload.page_path, 255);
    const screenName = cleanString(payload.screen_name, 120);
    const section = cleanString(payload.section, 120);
    const element = cleanString(payload.element, 120);
    const referrer = cleanString(payload.referrer, 255);

    try {
      await pool.query(
        `
          INSERT INTO analytics_events (
            user_id,
            session_id,
            event_name,
            page_path,
            screen_name,
            section,
            element,
            referrer,
            properties
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          userId,
          sessionId,
          eventName,
          pagePath,
          screenName,
          section,
          element,
          referrer,
          normalizeProperties(payload.properties),
        ]
      );

      return { ok: true };
    } catch (err) {
      request.log.error({ err }, 'Failed to store analytics event');
      return reply.status(500).send({ message: 'Failed to store analytics event' });
    }
  });

  // Real response-time: average gap between an inbound message (other → me)
  // and my next reply in the same conversation, capped at 48h to ignore
  // abandoned threads.
  fastify.get('/reply-time', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' });

    const res = await pool.query(
      `
      WITH pairs AS (
        SELECT
          inbound.conversation_id,
          inbound.created_at AS inbound_at,
          (SELECT MIN(out.created_at)
           FROM messages out
           WHERE out.conversation_id = inbound.conversation_id
             AND out.sender_id = $1
             AND out.created_at > inbound.created_at
             AND out.created_at < inbound.created_at + INTERVAL '48 hours'
          ) AS reply_at
        FROM messages inbound
        WHERE inbound.conversation_id IN (
          SELECT id FROM conversations
          WHERE participant_a = $1 OR participant_b = $1
        )
          AND inbound.sender_id <> $1
      )
      SELECT
        COUNT(*)::int AS samples,
        COALESCE(
          ROUND(AVG(EXTRACT(EPOCH FROM (reply_at - inbound_at)) / 60)::numeric, 0),
          0
        )::int AS avg_minutes
      FROM pairs
      WHERE reply_at IS NOT NULL
      `,
      [userId]
    );

    const row = res.rows[0] || { samples: 0, avg_minutes: 0 };
    return {
      samples: row.samples,
      avg_minutes: row.avg_minutes,
      label: row.samples === 0
        ? null
        : row.avg_minutes < 60
          ? 'Under 1 hour'
          : row.avg_minutes < 1440
            ? `~${Math.round(row.avg_minutes / 60)}h`
            : `~${Math.round(row.avg_minutes / 1440)}d`,
    };
  });
}

module.exports = analyticsRoutes;
