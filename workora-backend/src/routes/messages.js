async function messageRoutes(fastify) {
  const { pool } = fastify;
  const resolveActorId = (request) => request.user?.id;

  // 1. GET CONVERSATIONS for a user
  fastify.get('/conversations/:userId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { userId } = request.params;
    const actorId = resolveActorId(request);
    if (actorId && actorId !== userId) {
      return reply.status(403).send({ message: 'Forbidden' });
    }
    const res = await pool.query(`
      SELECT c.*, 
        CASE WHEN c.participant_1 = $1 THEN u2.username ELSE u1.username END as other_username,
        CASE WHEN c.participant_1 = $1 THEN c.participant_2 ELSE c.participant_1 END as other_user_id,
        (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != $1 AND m.is_read = false) as unread_count
      FROM conversations c
      JOIN users u1 ON c.participant_1 = u1.id
      JOIN users u2 ON c.participant_2 = u2.id
      WHERE c.participant_1 = $1 OR c.participant_2 = $1
      ORDER BY c.last_message_at DESC
    `, [userId]);
    return res.rows;
  });

  // 2. GET or CREATE conversation between two users
  fastify.post('/conversations', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { other_user_id } = request.body;
    const user_id = resolveActorId(request);
    
    // Check if conversation exists
    const existing = await pool.query(`
      SELECT * FROM conversations 
      WHERE (participant_1 = $1 AND participant_2 = $2) 
         OR (participant_1 = $2 AND participant_2 = $1)
    `, [user_id, other_user_id]);

    if (existing.rows.length > 0) return existing.rows[0];

    const res = await pool.query(
      'INSERT INTO conversations (participant_1, participant_2) VALUES ($1, $2) RETURNING *',
      [user_id, other_user_id]
    );
    return res.rows[0];
  });

  // 3. GET MESSAGES in a conversation
  fastify.get('/:conversationId', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { conversationId } = request.params;
    const res = await pool.query(`
      SELECT m.*, u.username as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
    `, [conversationId]);
    return res.rows;
  });

  // 4. SEND MESSAGE
  fastify.post('/:conversationId/send', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { conversationId } = request.params;
    const { text } = request.body;
    const sender_id = resolveActorId(request);

    const res = await pool.query(
      'INSERT INTO messages (conversation_id, sender_id, text) VALUES ($1, $2, $3) RETURNING *',
      [conversationId, sender_id, text]
    );

    // Update conversation last message
    await pool.query(
      'UPDATE conversations SET last_message_text = $1, last_message_at = CURRENT_TIMESTAMP WHERE id = $2',
      [text, conversationId]
    );

    return res.rows[0];
  });

  // 5. MARK MESSAGES AS READ
  fastify.patch('/:conversationId/read', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { conversationId } = request.params;
    const user_id = resolveActorId(request);
    await pool.query(
      'UPDATE messages SET is_read = true WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false',
      [conversationId, user_id]
    );
    return { success: true };
  });
}

module.exports = messageRoutes;
