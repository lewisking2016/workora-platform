/**
 * Migration: Update all gig video_url and thumbnail_url to use absolute URLs
 * pointing to the web app's public folder (where the demo videos already exist).
 *
 * This ensures demo videos work from:
 * - Web app (Vercel) — already served from public/videos/
 * - Mobile app — absolute URLs work without proxy
 * - Backend API — absolute URLs bypass backend entirely
 *
 * Usage: node update-demo-video-urls.js
 * Requires DATABASE_URL in environment or .env file.
 * Set WEB_APP_URL to override (default: https://workora.imeantech.com).
 */
require('dotenv').config();
const { Pool } = require('pg');

const WEB_APP_URL = process.env.WEB_APP_URL || 'https://workora.imeantech.com';

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
    console.log(`Using web app URL: ${WEB_APP_URL}`);

    let updated = 0;
    let skipped = 0;

    for (const gig of rows) {
      const category = (gig.category || 'construction').toLowerCase();
      const videos = CATEGORY_VIDEO_MAP[category] || CATEGORY_VIDEO_MAP.construction;
      const thumbs = CATEGORY_THUMB_MAP[category] || CATEGORY_THUMB_MAP.construction;

      const idx = hashStr(gig.id) % videos.length;
      const video = videos[idx];
      const thumb = thumbs[idx % thumbs.length];

      // Build absolute URLs pointing to the web app's public folder
      const newVideoUrl = `${WEB_APP_URL}/videos/${encodeFilename(video)}`;
      const newThumbUrl = `${WEB_APP_URL}/thumbnails/${encodeFilename(thumb)}`;

      // Skip gigs that already have real external URLs (Pexels, Pixabay, R2, etc.)
      const isRealUrl = gig.video_url && (
        gig.video_url.includes('r2.cloudflarestorage.com') ||
        gig.video_url.includes('videos.pexels.com') ||
        gig.video_url.includes('pixabay.com') ||
        gig.video_url.includes('unsplash.com') ||
        gig.video_url.includes('cdn.') 
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
    console.log(`\nSample URLs:`);
    if (updated > 0) {
      const sample = await pool.query('SELECT video_url, thumbnail_url FROM gigs LIMIT 3');
      sample.rows.forEach(r => console.log(`  video: ${r.video_url}`));
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
