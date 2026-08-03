const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;

function getS3Client() {
  return new S3Client({
    region: 'auto',
    endpoint: cleanEnv(process.env.R2_ENDPOINT),
    credentials: {
      accessKeyId: cleanEnv(process.env.R2_ACCESS_KEY_ID),
      secretAccessKey: cleanEnv(process.env.R2_SECRET_ACCESS_KEY),
    },
  });
}

const BUCKET = 'workora';
const PUBLIC_URL = `https://pub-${cleanEnv(process.env.R2_ACCOUNT_ID)}.r2.dev`;

async function uploadRoutes(fastify) {
  const { pool } = fastify;

  const uploadProfileAsset = async (request, reply, options) => {
    const data = await request.file();
    if (!data) return reply.status(400).send({ error: 'No file uploaded' });

    const userId = request.user?.id;
    if (!userId) return reply.status(400).send({ error: 'user_id is required' });

    const ext = path.extname(data.filename) || options.defaultExt;
    const key = `${options.folder}/${userId}/${Date.now()}${ext}`;
    const buffer = await data.toBuffer();

    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: data.mimetype,
    }));

    const publicUrl = `${PUBLIC_URL}/${key}`;
    await pool.query(options.updateSql, [publicUrl, userId]);

    return { success: true, url: publicUrl };
  };

  // 1. UPLOAD AVATAR
  fastify.post('/avatar', { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
      return await uploadProfileAsset(request, reply, {
        folder: 'avatars',
        defaultExt: '.jpg',
        updateSql: 'UPDATE worker_profiles SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      });
    } catch (err) {
      fastify.log.error({ err }, 'Avatar upload failed');
      return reply.status(500).send({ error: 'Upload failed', details: err.message });
    }
  });

  fastify.post('/cover', { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
      return await uploadProfileAsset(request, reply, {
        folder: 'covers',
        defaultExt: '.jpg',
        updateSql: 'UPDATE worker_profiles SET cover_url = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      });
    } catch (err) {
      fastify.log.error({ err }, 'Cover upload failed');
      return reply.status(500).send({ error: 'Upload failed', details: err.message });
    }
  });

  fastify.post('/identity', { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
      const result = await uploadProfileAsset(request, reply, {
        folder: 'identity',
        defaultExt: '.pdf',
        updateSql: `
          UPDATE worker_profiles
          SET identity_document_url = $1,
              identity_status = 'pending',
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $2`,
      });
      return result;
    } catch (err) {
      fastify.log.error({ err }, 'Identity upload failed');
      return reply.status(500).send({ error: 'Upload failed', details: err.message });
    }
  });

  // 2. UPLOAD GIG MEDIA (video or thumbnail)
  fastify.post('/gig', { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) return reply.status(400).send({ error: 'No file uploaded' });

      const workerId = request.user?.id;
      const mediaType = data.fields.media_type?.value || 'thumbnail'; // 'video' or 'thumbnail'
      if (!workerId) return reply.status(400).send({ error: 'worker_id is required' });

      const ext = path.extname(data.filename) || (mediaType === 'video' ? '.mp4' : '.jpg');
      const key = `gigs/${workerId}/${mediaType}_${Date.now()}${ext}`;
      const buffer = await data.toBuffer();

      const s3 = getS3Client();
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: data.mimetype,
      }));

      const publicUrl = `${PUBLIC_URL}/${key}`;
      return { success: true, url: publicUrl, type: mediaType };
    } catch (err) {
      fastify.log.error({ err }, 'Gig media upload failed');
      return reply.status(500).send({ error: 'Upload failed', details: err.message });
    }
  });
}

module.exports = uploadRoutes;
