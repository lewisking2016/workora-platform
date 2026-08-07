/**
 * Fix Neon DB schema gaps that break feed/profile/search.
 * Uses DATABASE_URL from workora-backend/.env
 */
require('dotenv').config();
const { Client } = require('pg');

const SAMPLE_VIDEOS = [
  {
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
  },
  {
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
  },
  {
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
  },
  {
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
  },
  {
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
  },
];

const STATEMENTS = [
  [
    'CREATE TABLE user_follows',
    `CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_user_id)
)`,
  ],
  [
    'CREATE TABLE user_mutes',
    `CREATE TABLE IF NOT EXISTS user_mutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    muted_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, muted_user_id)
)`,
  ],
  [
    'CREATE TABLE user_blocks',
    `CREATE TABLE IF NOT EXISTS user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_user_id)
)`,
  ],
  [
    'CREATE TABLE gig_hides',
    `CREATE TABLE IF NOT EXISTS gig_hides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, gig_id)
)`,
  ],
  [
    'CREATE TABLE gig_reports',
    `CREATE TABLE IF NOT EXISTS gig_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`,
  ],
  ['ALTER users.username', `ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE`],
  ['ALTER users.birthday', `ALTER TABLE users ADD COLUMN IF NOT EXISTS birthday DATE`],
  ['ALTER users.team_type', `ALTER TABLE users ADD COLUMN IF NOT EXISTS team_type TEXT DEFAULT 'solo'`],
  ['ALTER users.subscription', `ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription TEXT DEFAULT 'free'`],
  ['ALTER worker_profiles.display_name', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS display_name TEXT`],
  ['ALTER worker_profiles.title', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS title TEXT`],
  ['ALTER gigs.description', `ALTER TABLE gigs ADD COLUMN IF NOT EXISTS description TEXT`],
  ['ALTER gigs.category', `ALTER TABLE gigs ADD COLUMN IF NOT EXISTS category TEXT`],
  ['ALTER gigs.price', `ALTER TABLE gigs ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0.0`],
  ['ALTER worker_profiles.profile_visibility', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public'`],
  ['ALTER worker_profiles.account_status', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active'`],
  ['ALTER worker_profiles.verification_status', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'`],
  ['ALTER worker_profiles.availability_status', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available'`],
  ['ALTER worker_profiles.service_areas', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS service_areas TEXT`],
  ['ALTER worker_profiles.cover_url', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS cover_url TEXT`],
  ['ALTER worker_profiles.pricing_from', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS pricing_from DECIMAL(10, 2) DEFAULT 0.0`],
  ['ALTER worker_profiles.identity_status', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS identity_status TEXT DEFAULT 'unverified'`],
  ['ALTER worker_profiles.identity_document_url', `ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS identity_document_url TEXT`],
];

const OPTIONAL_STATEMENTS = [
  ['ALTER messages.delivery_status', `ALTER TABLE messages ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'sent'`],
  ['ALTER messages.edited_at', `ALTER TABLE messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE`],
  ['ALTER messages.deleted_at', `ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE`],
  ['ALTER auth_login_attempts.failed_count', `ALTER TABLE auth_login_attempts ADD COLUMN IF NOT EXISTS failed_count INTEGER DEFAULT 0`],
  ['ALTER auth_login_attempts.locked_until', `ALTER TABLE auth_login_attempts ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE`],
  ['ALTER auth_login_attempts.last_failed_at', `ALTER TABLE auth_login_attempts ADD COLUMN IF NOT EXISTS last_failed_at TIMESTAMP WITH TIME ZONE`],
  ['ALTER auth_login_attempts.updated_at', `ALTER TABLE auth_login_attempts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`],
  ['ALTER notification_preferences.likes_enabled', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS likes_enabled BOOLEAN DEFAULT TRUE`],
  ['ALTER notification_preferences.comments_enabled', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS comments_enabled BOOLEAN DEFAULT TRUE`],
  ['ALTER notification_preferences.follows_enabled', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS follows_enabled BOOLEAN DEFAULT TRUE`],
  ['ALTER notification_preferences.mentions_enabled', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS mentions_enabled BOOLEAN DEFAULT TRUE`],
  ['ALTER notification_preferences.messages_enabled', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS messages_enabled BOOLEAN DEFAULT TRUE`],
  ['ALTER notification_preferences.trust_updates_enabled', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS trust_updates_enabled BOOLEAN DEFAULT TRUE`],
  ['ALTER notification_preferences.system_enabled', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS system_enabled BOOLEAN DEFAULT TRUE`],
  ['ALTER notification_preferences.push_enabled', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS push_enabled BOOLEAN DEFAULT TRUE`],
  ['ALTER notification_preferences.updated_at', `ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`],
];

async function run() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error('DATABASE_URL missing from .env');
    process.exit(1);
  }
  const connectionString = String(rawUrl).replace(/^["'](.+)["']$/, '$1');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to Neon DB\n');

  const results = { created: [], altered: [], failed: [], videosUpdated: 0 };

  for (const [label, sql] of STATEMENTS) {
    try {
      await client.query(sql);
      console.log(`OK: ${label}`);
      if (label.startsWith('CREATE')) results.created.push(label);
      else results.altered.push(label);
    } catch (err) {
      console.error(`FAIL: ${label} — ${err.message}`);
      results.failed.push({ label, error: err.message });
    }
  }

  console.log('\n--- Optional ALTER statements ---');
  for (const [label, sql] of OPTIONAL_STATEMENTS) {
    try {
      await client.query(sql);
      console.log(`OK: ${label}`);
      results.altered.push(label);
    } catch (err) {
      console.error(`SKIP/FAIL: ${label} — ${err.message}`);
      results.failed.push({ label, error: err.message });
    }
  }

  console.log('\n--- Video URL updates ---');
  const placeholderRes = await client.query(
    `SELECT id FROM gigs
     WHERE video_url = '/uploads/placeholder-video.mp4'
        OR video_url IS NULL
        OR video_url = ''
        OR video_url NOT LIKE 'http%'
     ORDER BY created_at`
  );
  console.log(`Gigs needing video update: ${placeholderRes.rows.length}`);

  for (let i = 0; i < placeholderRes.rows.length; i++) {
    const sample = SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length];
    await client.query(
      `UPDATE gigs SET video_url = $1, thumbnail_url = $2 WHERE id = $3`,
      [sample.video, sample.thumb, placeholderRes.rows[i].id]
    );
    results.videosUpdated++;
  }
  console.log(`Videos updated: ${results.videosUpdated}`);

  console.log('\n--- Verification ---');
  const gigsCount = await client.query('SELECT COUNT(*)::int AS c FROM gigs');
  const followsCount = await client.query('SELECT COUNT(*)::int AS c FROM user_follows');
  console.log(`gigs COUNT: ${gigsCount.rows[0].c}`);
  console.log(`user_follows COUNT: ${followsCount.rows[0].c}`);

  const sampleVids = await client.query(
    `SELECT left(video_url, 90) AS video_url, left(COALESCE(thumbnail_url,''), 90) AS thumb
     FROM gigs ORDER BY created_at LIMIT 5`
  );
  console.log('Sample gig videos:');
  sampleVids.rows.forEach((r) => console.log(`  ${r.video_url} | ${r.thumb}`));

  await client.end();

  console.log('\n--- API verification ---');
  const base = 'http://4.221.170.153:3001';
  let token = null;

  try {
    const loginRes = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '+254700000001',
        phone_number: '+254700000001',
        password: 'james2026',
      }),
    });
    const loginBody = await loginRes.json().catch(() => ({}));
    console.log(`LOGIN status: ${loginRes.status}`);
    token = loginBody.token;
    if (!token) {
      console.log('Login response keys:', Object.keys(loginBody));
      console.log('Login response (truncated):', JSON.stringify(loginBody).slice(0, 800));
    } else {
      console.log('LOGIN ok, token received');
    }
  } catch (err) {
    console.error('LOGIN error:', err.message);
  }

  async function check(path, label) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      console.log(`${label}: ${res.status}`);
      if (res.status !== 200) {
        console.log(
          `${label} error body:`,
          typeof body === 'string' ? body.slice(0, 3000) : JSON.stringify(body, null, 2).slice(0, 3000)
        );
      } else if (label === 'FEED') {
        const arr = Array.isArray(body) ? body : body?.gigs || body?.data || null;
        console.log(
          `FEED ok — isArray=${Array.isArray(body)} topKeys=${
            body && typeof body === 'object' && !Array.isArray(body) ? Object.keys(body).join(',') : 'array'
          } items=${Array.isArray(arr) ? arr.length : 'n/a'}`
        );
      }
      return res.status;
    } catch (err) {
      console.error(`${label} request failed:`, err.message);
      return null;
    }
  }

  const feedStatus = await check('/gigs/feed?scope=new&limit=3', 'FEED');
  const meStatus = await check('/profile/me', 'PROFILE_ME');
  const searchStatus = await check('/profile/search?sort=trust', 'PROFILE_SEARCH');

  if (searchStatus === 500) {
    console.log('\nRe-fetching PROFILE_SEARCH for full error...');
    await check('/profile/search?sort=trust', 'PROFILE_SEARCH_RETRY');
  }

  console.log('\n=== SUMMARY ===');
  console.log(
    JSON.stringify(
      {
        created: results.created,
        altered: results.altered,
        failed: results.failed,
        videosUpdated: results.videosUpdated,
        gigsCount: gigsCount.rows[0].c,
        followsCount: followsCount.rows[0].c,
        feedStatus,
        meStatus,
        searchStatus,
      },
      null,
      2
    )
  );
}

run().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
