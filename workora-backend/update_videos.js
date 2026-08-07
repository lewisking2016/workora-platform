require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.replace(/^["'](.+)["']$/, '$1'),
  ssl: { rejectUnauthorized: false },
});

const SAMPLE = [
  ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg'],
  ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg'],
  ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg'],
  ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg'],
  ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg'],
];

async function main() {
  const res = await pool.query(
    `SELECT id FROM gigs WHERE video_url IS NULL OR video_url NOT LIKE 'http%'`
  );
  let i = 0;
  for (const row of res.rows) {
    const [video, thumb] = SAMPLE[i % SAMPLE.length];
    await pool.query('UPDATE gigs SET video_url = $1, thumbnail_url = $2 WHERE id = $3', [
      video,
      thumb,
      row.id,
    ]);
    i += 1;
  }
  console.log('Updated', i, 'gigs to playable sample videos');
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
