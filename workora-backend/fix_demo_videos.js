// One-off maintenance: the demo feed pointed at Google's gtv-videos-bucket,
// which now returns 403 for every file. Repoint all gigs at the working demo
// videos shipped in the web app's /public/videos (served by the web host).
// Each gig gets a deterministic video based on its id so the mapping is stable.
//
// Run:  node fix_demo_videos.js
require('dotenv').config();
const { Pool } = require('pg');

const VIDEOS = [
  'construction.mp4',
  'construction2.mp4',
  'electrical1.mp4',
  'electrical2.mp4',
  'electrical3.mp4',
  'electrical4.mp4',
  'electrical5.mp4',
  'plumbing1.mp4',
  'plumbing2.mp4',
  'plumbing3.mp4',
  'plumbing5.mp4',
];

const enc = (name) => name.split(' ').map((p) => encodeURIComponent(p)).join('%20');

const hash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query('SELECT id, video_url FROM gigs');
  console.log(`Gigs to update: ${rows.length}`);

  let updated = 0;
  for (const gig of rows) {
    const video = VIDEOS[hash(gig.id) % VIDEOS.length];
    const videoUrl = `/videos/${enc(video)}`;
    const thumbUrl = `/thumbnails/${enc(video.replace(/\.mp4$/, '.jpg'))}`;
    await pool.query('UPDATE gigs SET video_url = $1, thumbnail_url = $2 WHERE id = $3', [
      videoUrl,
      thumbUrl,
      gig.id,
    ]);
    updated += 1;
  }

  console.log(`Updated ${updated} gigs → ${VIDEOS.length} local demo videos`);
  await pool.end();
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
