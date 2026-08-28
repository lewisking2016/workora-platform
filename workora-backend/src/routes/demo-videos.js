const fs = require('fs');
const path = require('path');

/**
 * Demo video proxy route — serves local demo videos from /demo/videos/:filename.
 * Used for investor demos and presentation mode so that video URLs work from
 * both the web app and the backend / mobile app without depending on Vercel's
 * public/ folder.
 */
async function demoVideoRoutes(fastify) {
  // Ensure the demo directory exists
  const demoDir = path.join(__dirname, '..', '..', 'demo-videos');

  // Map of category keywords to demo video files
  const CATEGORY_VIDEO_MAP = {
    plumbing: ['plumbing1.mp4', 'plumbing2.mp4', 'plumbing3.mp4', 'plumbing5.mp4'],
    electrician: ['electrical1.mp4', 'electrical2.mp4', 'electrical3.mp4', 'electrical4.mp4', 'electrical5.mp4'],
    electrical: ['electrical1.mp4', 'electrical2.mp4', 'electrical3.mp4', 'electrical4.mp4', 'electrical5.mp4'],
    construction: ['construction.mp4', 'construction2.mp4', 'construction%203.mp4'],
    mason: ['construction.mp4', 'construction2.mp4', 'construction%203.mp4'],
  };

  const DEMO_THUMBNAIL_MAP = {
    plumbing: ['plumbing1.jpg', 'plumbing2.jpg', 'plumbing3.jpg', 'plumbing5.jpg'],
    electrician: ['electrical1.jpg', 'electrical2.jpg', 'electrical3.jpg', 'electrical4.jpg', 'electrical5.jpg'],
    electrical: ['electrical1.jpg', 'electrical2.jpg', 'electrical3.jpg', 'electrical4.jpg', 'electrical5.jpg'],
    construction: ['construction.jpg', 'construction2.jpg', 'construction%203.jpg'],
    mason: ['construction.jpg', 'construction2.jpg', 'construction%203.jpg'],
  };

  // GET /demo/videos/:filename — serve a specific demo video file
  fastify.get('/videos/:filename', async (request, reply) => {
    const { filename } = request.params;
    const decoded = decodeURIComponent(filename);
    const filePath = path.join(demoDir, decoded);

    // Security: prevent directory traversal
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

    // Support Range requests for video seeking
    const range = request.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 10 * 1024 * 1024 - 1, stat.size - 1); // 10MB chunks
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(filePath, { start, end });
      reply.code(206).header('Content-Range', `bytes ${start}-${end}/${stat.size}`);
      reply.header('Accept-Ranges', 'bytes');
      reply.header('Content-Length', chunkSize);
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

  // GET /demo/video-for-gig — returns a deterministic demo video URL for a gig ID
  // Used by the migration script and frontend
  fastify.get('/video-for-gig', async (request, reply) => {
    const gigId = String(request.query.gig_id || '');
    const category = String(request.query.category || 'construction').toLowerCase();

    if (!gigId) {
      return reply.status(400).send({ error: 'gig_id is required' });
    }

    // Deterministic hash for consistent mapping
    let hash = 0;
    for (let i = 0; i < gigId.length; i++) {
      hash = ((hash << 5) - hash + gigId.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash);

    const videos = CATEGORY_VIDEO_MAP[category] || CATEGORY_VIDEO_MAP.construction;
    const video = videos[idx % videos.length];
    const thumbnails = DEMO_THUMBNAIL_MAP[category] || DEMO_THUMBNAIL_MAP.construction;
    const thumbnail = thumbnails[idx % thumbnails.length];

    return {
      video_url: `/demo/videos/${video}`,
      thumbnail_url: `/demo/videos/${thumbnail}`,
    };
  });

  // GET /demo/health — check if demo video files exist
  fastify.get('/health', async () => {
    const exists = fs.existsSync(demoDir);
    let fileCount = 0;
    if (exists) {
      fileCount = fs.readdirSync(demoDir).filter(f => f.endsWith('.mp4')).length;
    }
    return { demoVideosReady: exists, videoFileCount: fileCount };
  });
}

module.exports = demoVideoRoutes;
