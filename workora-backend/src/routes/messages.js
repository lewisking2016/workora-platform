async function messageRoutes(fastify) {
  const { pool } = fastify;
  const resolveActorId = (request) => request.user?.id;

  const verifyConversationAccess = async (conversationId, userId) => {
    const conversationRes = await pool.query(
      'SELECT * FROM conversations WHERE id = $1 AND (participant_1 = $2 OR participant_2 = $2) LIMIT 1',
      [conversationId, userId]
    );
    return conversationRes.rows[0] || null;
  };

  const fetchConversationState = async (conversationId, userId) => {
    const res = await pool.query(
      `
      SELECT conversation_id, user_id, is_pinned, is_archived, is_muted, updated_at
      FROM conversation_states
      WHERE conversation_id = $1 AND user_id = $2
      LIMIT 1
      `,
      [conversationId, userId]
    );

    return res.rows[0] || {
      conversation_id: conversationId,
      user_id: userId,
      is_pinned: false,
      is_archived: false,
      is_muted: false,
    };
  };

  const upsertConversationState = async (conversationId, userId, patch) => {
    const current = await fetchConversationState(conversationId, userId);
    const next = {
      is_pinned: typeof patch.is_pinned === 'boolean' ? patch.is_pinned : current.is_pinned,
      is_archived: typeof patch.is_archived === 'boolean' ? patch.is_archived : current.is_archived,
      is_muted: typeof patch.is_muted === 'boolean' ? patch.is_muted : current.is_muted,
    };

    await pool.query(
      `
      INSERT INTO conversation_states (conversation_id, user_id, is_pinned, is_archived, is_muted, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (conversation_id, user_id)
      DO UPDATE SET
        is_pinned = EXCLUDED.is_pinned,
        is_archived = EXCLUDED.is_archived,
        is_muted = EXCLUDED.is_muted,
        updated_at = CURRENT_TIMESTAMP
      `,
      [conversationId, userId, next.is_pinned, next.is_archived, next.is_muted]
    );

    return next;
  };

  const loadMessages = async (conversationId) => {
    const res = await pool.query(
      `
      SELECT
        m.id,
        m.sender_id,
        u.username AS sender_name,
        CASE WHEN m.deleted_at IS NOT NULL THEN '[deleted]' ELSE m.text END AS text,
        m.is_read,
        m.delivery_status,
        m.edited_at,
        m.deleted_at,
        m.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ma.id,
              'file_url', ma.file_url,
              'file_type', ma.file_type,
              'file_name', ma.file_name
            )
          ) FILTER (WHERE ma.id IS NOT NULL),
          '[]'::json
        ) AS attachments
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      LEFT JOIN message_attachments ma ON ma.message_id = m.id
      WHERE m.conversation_id = $1
      GROUP BY m.id, u.username
      ORDER BY m.created_at ASC
      `,
      [conversationId]
    );

    return res.rows;
  };

  fastify.get('/conversations/:userId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { userId } = request.params;
    const actorId = resolveActorId(request);
    if (actorId && actorId !== userId) {
      return reply.status(403).send({ message: 'Forbidden' });
    }

    const res = await pool.query(
      `
      SELECT
        c.*,
        CASE WHEN c.participant_1 = $1 THEN u2.username ELSE u1.username END AS other_username,
        CASE WHEN c.participant_1 = $1 THEN c.participant_2 ELSE c.participant_1 END AS other_user_id,
        COALESCE(cs.is_pinned, false) AS is_pinned,
        COALESCE(cs.is_archived, false) AS is_archived,
        COALESCE(cs.is_muted, false) AS is_muted,
        (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != $1 AND m.is_read = false AND m.deleted_at IS NULL) AS unread_count
      FROM conversations c
      JOIN users u1 ON c.participant_1 = u1.id
      JOIN users u2 ON c.participant_2 = u2.id
      LEFT JOIN conversation_states cs ON cs.conversation_id = c.id AND cs.user_id = $1
      WHERE c.participant_1 = $1 OR c.participant_2 = $1
      ORDER BY COALESCE(cs.is_pinned, false) DESC, c.last_message_at DESC
      `,
      [userId]
    );

    return res.rows;
  });

  fastify.post('/conversations', { preHandler: fastify.authenticate }, async (request) => {
    const { other_user_id } = request.body;
    const user_id = resolveActorId(request);

    const existing = await pool.query(
      `
      SELECT * FROM conversations
      WHERE (participant_1 = $1 AND participant_2 = $2)
         OR (participant_1 = $2 AND participant_2 = $1)
      LIMIT 1
      `,
      [user_id, other_user_id]
    );

    if (existing.rows.length > 0) return existing.rows[0];

    const res = await pool.query(
      'INSERT INTO conversations (participant_1, participant_2) VALUES ($1, $2) RETURNING *',
      [user_id, other_user_id]
    );

    return res.rows[0];
  });

  fastify.get('/conversations/:conversationId/state', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const conversation = await verifyConversationAccess(request.params.conversationId, userId);
    if (!conversation) {
      return reply.status(404).send({ message: 'Conversation not found' });
    }

    const state = await fetchConversationState(conversation.id, userId);
    return { conversation_id: conversation.id, ...state };
  });

  fastify.patch('/conversations/:conversationId/state', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const conversation = await verifyConversationAccess(request.params.conversationId, userId);
    if (!conversation) {
      return reply.status(404).send({ message: 'Conversation not found' });
    }

    const next = await upsertConversationState(conversation.id, userId, request.body || {});
    return { conversation_id: conversation.id, ...next };
  });

  fastify.get('/:conversationId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const conversation = await verifyConversationAccess(request.params.conversationId, userId);
    if (!conversation) {
      return reply.status(404).send({ message: 'Conversation not found' });
    }

    return loadMessages(conversation.id);
  });

  fastify.post('/:conversationId/send', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const conversation = await verifyConversationAccess(request.params.conversationId, userId);
    if (!conversation) {
      return reply.status(404).send({ message: 'Conversation not found' });
    }

    const { text, attachments = [], delivery_status } = request.body || {};
    const status = delivery_status === 'failed' ? 'failed' : 'sent';
    const messageText = typeof text === 'string' ? text.trim() : '';

    const inserted = await pool.query(
      `
      INSERT INTO messages (conversation_id, sender_id, text, delivery_status, is_read)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [conversation.id, userId, messageText || '[media message]', status, false]
    );

    const message = inserted.rows[0];

    if (Array.isArray(attachments) && attachments.length > 0) {
      for (const attachment of attachments) {
        if (!attachment?.file_url) continue;
        await pool.query(
          `
          INSERT INTO message_attachments (message_id, file_url, file_type, file_name)
          VALUES ($1, $2, $3, $4)
          `,
          [message.id, attachment.file_url, attachment.file_type || null, attachment.file_name || null]
        );
      }
    }

    await pool.query(
      'UPDATE conversations SET last_message_text = $1, last_message_at = CURRENT_TIMESTAMP WHERE id = $2',
      [messageText || '[media message]', conversation.id]
    );

    return message;
  });

  fastify.put('/:conversationId/messages/:messageId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const conversation = await verifyConversationAccess(request.params.conversationId, userId);
    if (!conversation) {
      return reply.status(404).send({ message: 'Conversation not found' });
    }

    const existing = await pool.query(
      'SELECT * FROM messages WHERE id = $1 AND conversation_id = $2 LIMIT 1',
      [request.params.messageId, conversation.id]
    );
    const message = existing.rows[0];
    if (!message) return reply.status(404).send({ message: 'Message not found' });
    if (message.sender_id !== userId) return reply.status(403).send({ message: 'Forbidden' });

    const { text } = request.body || {};
    const nextText = typeof text === 'string' ? text.trim() : '';

    const updated = await pool.query(
      `
      UPDATE messages
      SET text = $1, edited_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [nextText, message.id]
    );

    return updated.rows[0];
  });

  fastify.delete('/:conversationId/messages/:messageId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const conversation = await verifyConversationAccess(request.params.conversationId, userId);
    if (!conversation) {
      return reply.status(404).send({ message: 'Conversation not found' });
    }

    const existing = await pool.query(
      'SELECT * FROM messages WHERE id = $1 AND conversation_id = $2 LIMIT 1',
      [request.params.messageId, conversation.id]
    );
    const message = existing.rows[0];
    if (!message) return reply.status(404).send({ message: 'Message not found' });
    if (message.sender_id !== userId) return reply.status(403).send({ message: 'Forbidden' });

    await pool.query(
      `
      UPDATE messages
      SET deleted_at = CURRENT_TIMESTAMP, text = '[deleted]'
      WHERE id = $1
      `,
      [message.id]
    );

    return { deleted: true };
  });

  fastify.post('/:conversationId/messages/:messageId/retry', { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = resolveActorId(request);
    const conversation = await verifyConversationAccess(request.params.conversationId, userId);
    if (!conversation) {
      return reply.status(404).send({ message: 'Conversation not found' });
    }

    const existing = await pool.query(
      'SELECT * FROM messages WHERE id = $1 AND conversation_id = $2 LIMIT 1',
      [request.params.messageId, conversation.id]
    );
    const message = existing.rows[0];
    if (!message) return reply.status(404).send({ message: 'Message not found' });
    if (message.sender_id !== userId) return reply.status(403).send({ message: 'Forbidden' });

    const updated = await pool.query(
      `
      UPDATE messages
      SET delivery_status = 'sent'
      WHERE id = $1
      RETURNING *
      `,
      [message.id]
    );

    return updated.rows[0];
  });

  fastify.patch('/:conversationId/read', { preHandler: fastify.authenticate }, async (request) => {
    const userId = resolveActorId(request);
    const conversation = await verifyConversationAccess(request.params.conversationId, userId);
    if (!conversation) {
      return { success: false };
    }

    await pool.query(
      `
      UPDATE messages
      SET is_read = true
      WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false AND deleted_at IS NULL
      `,
      [conversation.id, userId]
    );

    return { success: true };
  });
}

module.exports = messageRoutes;
