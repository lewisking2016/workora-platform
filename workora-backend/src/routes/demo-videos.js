const fs = require('fs');
const path = require('path');

/**
 * Demo video proxy route — serves local demo videos from /demo/videos/:filename.
 * Falls back gracefully if the demo-videos/ directory is not present
 * (excluded from Docker build via .dockerignore).
 *
 * For production, use absolute URLs to the web app's public/ folder instead.
 */
async function demoVideoRoutes(fastify) {
  const demoDir = path.join(__dirname, '..', '..', 'demo-videos');
  const hasDemoDir = fs.existsSync(demoDir);

  const CATEGORY_VIDEO_MAP = {
    plumbing: ['plumbing1.mp4', 'plumbing2.mp4', 'plumbing3.mp4', 'plumbing5.mp4'],
    electrician: ['electrical1.mp4', 'electrical2.mp4', 'electrical3.mp4', 'electrical4.mp4', 'electrical5.mp4'],
    electrical: ['electrical1.mp4', 'electrical2.mp4', 'electrical3.mp4', 'electrical4.mp4', 'electrical5.mp4'],
    construction: ['construction.mp4', 'construction2.mp4', 'construction%203.mp4'],
    mason: ['construction.mp4', 'construction2.mp4', 'construction%203.mp4'],
  };

  const CATEGORY_THUMB_MAP = {
    plumbing: ['plumbing1.jpg', 'plumbing2.jpg', 'plumbing3.jpg', 'plumbing5.jpg'],
    electrician: ['electrical1.jpg', 'electrical2.jpg', 'electrical3.jpg', 'electrical4.jpg', 'electrical5.jpg'],
    electrical: ['electrical1.jpg', 'electrical2.jpg', 'electrical3.jpg', 'electrical4.jpg', 'electrical5.jpg'],
    construction: ['construction.jpg', 'construction2.jpg', 'construction%203.jpg'],
    mason: ['construction.jpg', 'construction2.jpg', 'construction%203.jpg'],
  };

  // GET /demo/videos/:filename
  fastify.get('/videos/:filename', async (request, reply) => {
    if (!hasDemoDir) {
      return reply.status(404).send({ error: 'Demo videos not available on this server' });
    }

    const { filename } = request.params;
    const decoded = decodeURIComponent(filename);
    const filePath = path.join(demoDir, decoded);

    if (!filePath.startsWith(demoDir)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: 'Video not found' });
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(decoded).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    const range = request.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 10 * 1024 * 1024 - 1, stat.size - 1);
      const stream = fs.createReadStream(filePath, { start, end });
      reply.code(206).header('Content-Range', `bytes ${start}-${end}/${stat.size}`);
      reply.header('Accept-Ranges', 'bytes');
      reply.header('Content-Length', end - start + 1);
      reply.header('Content-Type', contentType);
      reply.header('Cache-Control', 'public, max-age=86400');
      return reply.send(stream);
    }

    reply.header('Content-Length', stat.size);
    reply.header('Content-Type', contentType);
    reply.header('Accept-Ranges', 'bytes');
    reply.header('Cache-Control', 'public, max-age=86400');
    return reply.send(fs.createReadStream(filePath));
  });

  // GET /demo/video-for-gig — deterministic mapping
  fastify.get('/video-for-gig', async (request, reply) => {
    const gigId = String(request.query.gig_id || '');
    const category = String(request.query.category || 'construction').toLowerCase();

    if (!gigId) {
      return reply.status(400).send({ error: 'gig_id is required' });
    }

    let hash = 0;
    for (let i = 0; i < gigId.length; i++) {
      hash = ((hash << 5) - hash + gigId.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash);

    const videos = CATEGORY_VIDEO_MAP[category] || CATEGORY_VIDEO_MAP.construction;
    const video = videos[idx % videos.length];
    const thumbs = CATEGORY_THUMB_MAP[category] || CATEGORY_THUMB_MAP.construction;
    const thumb = thumbs[idx % thumbs.length];

    return {
      video_url: `/demo/videos/${video}`,
      thumbnail_url: `/demo/videos/${thumb}`,
    };
  });

  // GET /demo/health
  fastify.get('/health', async () => ({
    demoVideosReady: hasDemoDir,
    videoFileCount: hasDemoDir
      ? fs.readdirSync(demoDir).filter(f => f.endsWith('.mp4')).length
      : 0,
    note: hasDemoDir
      ? 'Serving demo videos from local filesystem'
      : 'Demo videos not bundled — use absolute URLs to web app public/ folder',
  }));
}

module.exports = demoVideoRoutes;
