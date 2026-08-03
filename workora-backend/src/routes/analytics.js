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
}

module.exports = analyticsRoutes;
