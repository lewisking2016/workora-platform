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

// Accept ANY image or video format (so no legitimate upload is ever blocked),
// plus PDF for identity documents. Some phones/drones label media files as
// application/octet-stream, so allow that when the filename extension is a
// recognized media extension. Everything else (HTML, executables, scripts,
// archives) is rejected.
// SVG is deliberately excluded: R2 serves uploaded objects inline, and an
// SVG can carry scripts that execute when loaded directly — a stored-XSS
// vector on a trusted domain.
const MEDIA_EXTENSIONS = /^\.(jpe?g|png|webp|gif|heic|heif|bmp|tiff?|avif|mp4|m4v|mov|webm|mkv|avi|wmv|flv|mpe?g|mpg|mp2t|ts|ogv|ogg|3gpp|3gp|pdf)$/i;

function isAllowedFile(mimetype, filename) {
  const cleanMime = String(mimetype || '').split(';')[0].trim().toLowerCase();
  // Explicitly reject anything scriptable or polyglot (SVG, HTML, XML).
  if (cleanMime === 'image/svg+xml' || cleanMime === 'text/html' || cleanMime === 'application/xhtml+xml' || cleanMime === 'application/xml' || cleanMime === 'text/xml') {
    return false;
  }
  if (cleanMime.startsWith('image/') || cleanMime.startsWith('video/')) return true;
  if (cleanMime === 'application/pdf') return true;
  if (cleanMime === 'application/octet-stream' && MEDIA_EXTENSIONS.test(path.extname(filename || '').toLowerCase())) return true;
  return false;
}

async function uploadRoutes(fastify) {
  const { pool } = fastify;

  const uploadProfileAsset = async (request, reply, options) => {
    const data = await request.file();
    if (!data) return reply.status(400).send({ error: 'No file uploaded' });      if (!isAllowedFile(data.mimetype, data.filename)) {
        return reply.status(415).send({
          error: 'File type not allowed',
          details: 'Only image and video files are accepted.',
        });
      }

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

      if (!isAllowedFile(data.mimetype, data.filename)) {
        return reply.status(415).send({
          error: 'File type not allowed',
          details: 'Only image and video files are accepted.',
        });
      }

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
