/**
 * Migration: Update all gig video_url and thumbnail_url to use the new
 * /demo/videos/ proxy route. This ensures demo videos work from both the
 * web app (via Vercel) and the backend API (for mobile app / investor demos).
 *
 * Usage: node update-demo-video-urls.js
 * Requires DATABASE_URL in environment or .env file.
 */
require('dotenv').config();
const { Pool } = require('pg');

const CATEGORY_VIDEO_MAP = {
  plumbing: ['plumbing1.mp4', 'plumbing2.mp4', 'plumbing3.mp4', 'plumbing5.mp4'],
  electrician: ['electrical1.mp4', 'electrical2.mp4', 'electrical3.mp4', 'electrical4.mp4', 'electrical5.mp4'],
  electrical: ['electrical1.mp4', 'electrical2.mp4', 'electrical3.mp4', 'electrical4.mp4', 'electrical5.mp4'],
  construction: ['construction.mp4', 'construction2.mp4', 'construction 3.mp4'],
  mason: ['construction.mp4', 'construction2.mp4', 'construction 3.mp4'],
  'civil works': ['construction.mp4', 'construction2.mp4', 'construction 3.mp4'],
};

const CATEGORY_THUMB_MAP = {
  plumbing: ['plumbing1.jpg', 'plumbing2.jpg', 'plumbing3.jpg', 'plumbing5.jpg'],
  electrician: ['electrical1.jpg', 'electrical2.jpg', 'electrical3.jpg', 'electrical4.jpg', 'electrical5.jpg'],
  electrical: ['electrical1.jpg', 'electrical2.jpg', 'electrical3.jpg', 'electrical4.jpg', 'electrical5.jpg'],
  construction: ['construction.jpg', 'construction2.jpg', 'construction 3.jpg'],
  mason: ['construction.jpg', 'construction2.jpg', 'construction 3.jpg'],
  'civil works': ['construction.jpg', 'construction2.jpg', 'construction 3.jpg'],
};

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function encodeFilename(name) {
  return name.split(' ').map(p => encodeURIComponent(p)).join('%20');
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const { rows } = await pool.query('SELECT id, category, video_url FROM gigs');
    console.log(`Found ${rows.length} gigs to update`);

    let updated = 0;
    let skipped = 0;

    for (const gig of rows) {
      const category = (gig.category || 'construction').toLowerCase();
      const videos = CATEGORY_VIDEO_MAP[category] || CATEGORY_VIDEO_MAP.construction;
      const thumbs = CATEGORY_THUMB_MAP[category] || CATEGORY_THUMB_MAP.construction;

      const idx = hashStr(gig.id) % videos.length;
      const video = videos[idx];
      const thumb = thumbs[idx % thumbs.length];

      const newVideoUrl = `/demo/videos/${encodeFilename(video)}`;
      const newThumbUrl = `/demo/videos/${encodeFilename(thumb)}`;

      // Only update if this is a demo gig (no real R2 URL)
      const isRealUrl = gig.video_url && (
        gig.video_url.includes('r2.cloudflarestorage.com') ||
        gig.video_url.includes('videos.pexels.com') ||
        gig.video_url.includes('pixabay.com') ||
        gig.video_url.includes('unsplash.com')
      );

      if (isRealUrl) {
        skipped++;
        continue;
      }

      await pool.query(
        'UPDATE gigs SET video_url = $1, thumbnail_url = $2 WHERE id = $3',
        [newVideoUrl, newThumbUrl, gig.id]
      );
      updated++;
    }

    console.log(`\nDone! Updated ${updated} gigs, skipped ${skipped} (real URLs preserved)`);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
