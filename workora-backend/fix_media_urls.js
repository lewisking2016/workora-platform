require('dotenv').config();
const { Client } = require('pg');

const cleanEnv = (val) => (val ? val.replace(/^["'](.+)["']$/, '$1') : val);

const client = new Client({
  connectionString: cleanEnv(process.env.DATABASE_URL),
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const VIDEO_POOL = {
  Plumber: [
    'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4',
  ],
  Electrician: [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
  ],
  Carpenter: [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  ],
  Mason: [
    'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  ],
  Painter: [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4',
  ],
  Mechanic: [
    'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4',
  ],
  Welder: [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
  ],
  default: [
    'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  ],
};

function pickVideo(category, index) {
  const pool = VIDEO_POOL[category] || VIDEO_POOL.default;
  return pool[index % pool.length];
}

async function main() {
  await client.connect();
  console.log('Repairing media URLs...');

  const res = await client.query(
    'SELECT id, category FROM gigs ORDER BY created_at ASC'
  );

  for (let i = 0; i < res.rows.length; i += 1) {
    const row = res.rows[i];
    const videoUrl = pickVideo(row.category, i);

    await client.query(
      'UPDATE gigs SET video_url = $1 WHERE id = $2',
      [videoUrl, row.id]
    );
  }

  console.log(`Updated ${res.rows.length} gigs`);
}

main()
  .catch((err) => {
    console.error('Failed to repair media URLs:', err);
    process.exit(1);
  })
  .finally(() => client.end());
