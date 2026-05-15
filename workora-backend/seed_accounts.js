/**
 * Workora Seed Script — Creates real test accounts with known passwords
 * 
 * Run: node seed_accounts.js
 * 
 * All accounts use password format: firstname2026
 * Example: James Kamau → password: james2026
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.replace(/^["'](.+)["']$/, '$1'),
  ssl: { rejectUnauthorized: false }
});

const SEED_USERS = [
  {
    phone_number: '+254700000001',
    username: 'jameskamau',
    email: 'james@workora.test',
    password: 'james2026',
    full_name: 'James Kamau',
    trade: 'Construction',
    role: 'worker',
    title: 'Master Electrician',
    bio: 'Professional electrician with 8 years of experience. Specializing in residential and commercial wiring, solar installations, and smart home systems across Nairobi.',
    location: 'Nairobi, Kenya',
    is_verified: true,
    trust_score: 4.8,
    total_gigs: 142,
  },
  {
    phone_number: '+254700000002',
    username: 'gracewanjiku',
    email: 'grace@workora.test',
    password: 'grace2026',
    full_name: 'Grace Wanjiku',
    trade: 'Fashion',
    role: 'worker',
    title: 'Interior Designer',
    bio: 'Award-winning interior designer transforming Nairobi spaces. Modern minimalist approach with African-inspired touches. Featured in Home & Living Kenya.',
    location: 'Westlands, Nairobi',
    is_verified: true,
    trust_score: 4.9,
    total_gigs: 89,
  },
  {
    phone_number: '+254700000003',
    username: 'dianamutua',
    email: 'diana@workora.test',
    password: 'diana2026',
    full_name: 'Diana Mutua',
    trade: 'Fashion',
    role: 'worker',
    title: 'Master Tailor',
    bio: 'Bespoke tailoring for men and women. Custom suits, traditional wear, and modern alterations. 12 years of precision craftsmanship.',
    location: 'Mombasa, Kenya',
    is_verified: true,
    trust_score: 4.9,
    total_gigs: 203,
  },
  {
    phone_number: '+254700000004',
    username: 'briankipchoge',
    email: 'brian@workora.test',
    password: 'brian2026',
    full_name: 'Brian Kipchoge',
    trade: 'Industrial',
    role: 'worker',
    title: 'Certified Welder',
    bio: 'AWS-certified welder specializing in structural steel, pipe welding, and custom fabrication. Safety-first approach.',
    location: 'Nakuru, Kenya',
    is_verified: false,
    trust_score: 4.7,
    total_gigs: 67,
  },
  {
    phone_number: '+254700000005',
    username: 'faithakinyi',
    email: 'faith@workora.test',
    password: 'faith2026',
    full_name: 'Faith Akinyi',
    trade: 'Domestic',
    role: 'worker',
    title: 'Professional Chef',
    bio: 'Cordon Bleu trained chef. Private events, corporate catering, and meal prep services. Fusion of African and international cuisines.',
    location: 'Kisumu, Kenya',
    is_verified: true,
    trust_score: 5.0,
    total_gigs: 156,
  },
  {
    phone_number: '+254700000006',
    username: 'samuelnjoroge',
    email: 'samuel@workora.test',
    password: 'samuel2026',
    full_name: 'Samuel Njoroge',
    trade: 'Construction',
    role: 'worker',
    title: 'Expert Painter',
    bio: 'Residential and commercial painting. Texture finishes, wallpaper installation, and decorative effects. Clean work guaranteed.',
    location: 'Thika, Kenya',
    is_verified: false,
    trust_score: 4.5,
    total_gigs: 44,
  },
];

// Sample gigs to seed for each user
const SEED_GIGS = {
  'jameskamau': [
    {
      title: 'Full House Wiring — Kilimani 3BR',
      description: 'Full house wiring completed in Kilimani. 3-bedroom apartment, modern switchboard installation with surge protection.',
      category: 'Construction',
      video_url: '/uploads/placeholder-video.mp4',
      thumbnail_url: '/uploads/placeholder-thumb.jpg',
      view_count: 2400,
      likes_count: 847,
      comments_count: 23,
    },
    {
      title: 'Solar Panel Installation — Karen',
      description: 'Complete 5kW solar panel system installed in Karen. Battery backup and smart monitoring included.',
      category: 'Construction',
      video_url: '/uploads/placeholder-video.mp4',
      thumbnail_url: '/uploads/placeholder-thumb.jpg',
      view_count: 1800,
      likes_count: 432,
      comments_count: 15,
    }
  ],
  'gracewanjiku': [
    {
      title: 'Office Transformation — Westlands',
      description: 'Before and after transformation of a client office in Westlands. Modern minimalist approach with custom furniture.',
      category: 'Fashion',
      video_url: '/uploads/placeholder-video.mp4',
      thumbnail_url: '/uploads/placeholder-thumb.jpg',
      view_count: 5100,
      likes_count: 1200,
      comments_count: 41,
    }
  ],
  'dianamutua': [
    {
      title: 'Custom Wedding Dress — Traditional Fusion',
      description: 'Designed and crafted a stunning wedding dress blending Kamba traditional patterns with modern silhouette.',
      category: 'Fashion',
      video_url: '/uploads/placeholder-video.mp4',
      thumbnail_url: '/uploads/placeholder-thumb.jpg',
      view_count: 8200,
      likes_count: 2100,
      comments_count: 89,
    }
  ],
  'briankipchoge': [
    {
      title: 'Steel Gate Fabrication',
      description: 'Custom steel gate with automated motor. Full security package with intercom integration.',
      category: 'Industrial',
      video_url: '/uploads/placeholder-video.mp4',
      thumbnail_url: '/uploads/placeholder-thumb.jpg',
      view_count: 3400,
      likes_count: 670,
      comments_count: 18,
    }
  ],
  'faithakinyi': [
    {
      title: 'Corporate Event Catering — 200 Guests',
      description: 'Full catering service for a tech company launch. African fusion menu with live cooking stations.',
      category: 'Domestic',
      video_url: '/uploads/placeholder-video.mp4',
      thumbnail_url: '/uploads/placeholder-thumb.jpg',
      view_count: 6700,
      likes_count: 1540,
      comments_count: 67,
    }
  ],
  'samuelnjoroge': [
    {
      title: 'Luxury Villa Painting — Runda',
      description: 'Complete interior and exterior painting of a 5-bedroom villa. Italian texture finish on feature walls.',
      category: 'Construction',
      video_url: '/uploads/placeholder-video.mp4',
      thumbnail_url: '/uploads/placeholder-thumb.jpg',
      view_count: 1200,
      likes_count: 310,
      comments_count: 9,
    }
  ],
};

// Seed comments from other users
const SEED_COMMENTS = [
  'Great work! Highly recommend.',
  'Is this available next week?',
  'Love the attention to detail!',
  'How much does this cost?',
  'Professional as always 🔥',
  'This is exactly what I need!',
  'Can you come to Mombasa?',
  'Bookmarked for later.',
  'The quality is incredible.',
  'Just hired through Workora. 10/10!',
];

// Seed ratings
const SEED_RATINGS = [5, 5, 4, 5, 5, 4, 5, 3, 5, 5, 4, 5];

async function seed() {
  const client = await pool.connect();

  try {
    // 1. Run V2 schema migration
    console.log('📦 Running schema V2 migration...');
    const schemaV2 = fs.readFileSync(path.join(__dirname, 'schema_v2.sql'), 'utf8');
    await client.query(schemaV2);
    console.log('✅ Schema V2 applied.');

    // 2. Create users and profiles
    const userMap = {}; // username → { userId, profileId }

    for (const user of SEED_USERS) {
      console.log(`👤 Seeding user: ${user.full_name} (${user.username})...`);

      // Check if user already exists
      const existing = await client.query('SELECT id FROM users WHERE phone_number = $1', [user.phone_number]);
      
      let userId;
      if (existing.rows.length > 0) {
        userId = existing.rows[0].id;
        console.log(`   ↳ User already exists (${userId}), updating...`);
      } else {
        // Create user
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        
        const userRes = await client.query(
          'INSERT INTO users (phone_number, email, username, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [user.phone_number, user.email, user.username, hash, user.role]
        );
        userId = userRes.rows[0].id;
        console.log(`   ↳ Created user: ${userId}`);
      }

      // Check/create profile
      const profileExisting = await client.query('SELECT id FROM worker_profiles WHERE user_id = $1', [userId]);
      
      let profileId;
      if (profileExisting.rows.length > 0) {
        profileId = profileExisting.rows[0].id;
        // Update profile
        await client.query(
          `UPDATE worker_profiles SET full_name=$1, display_name=$2, title=$3, trade=$4, bio=$5, location=$6, is_verified=$7, trust_score=$8, total_gigs=$9 WHERE user_id=$10`,
          [user.full_name, user.full_name, user.title, user.trade, user.bio, user.location, user.is_verified, user.trust_score, user.total_gigs, userId]
        );
      } else {
        const profileRes = await client.query(
          `INSERT INTO worker_profiles (user_id, full_name, display_name, title, trade, bio, location, is_verified, trust_score, total_gigs) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
          [userId, user.full_name, user.full_name, user.title, user.trade, user.bio, user.location, user.is_verified, user.trust_score, user.total_gigs]
        );
        profileId = profileRes.rows[0].id;
      }

      userMap[user.username] = { userId, profileId };
      console.log(`   ↳ Profile ready: ${profileId}`);
    }

    // 3. Create gigs for each user
    console.log('\n📹 Seeding gigs...');
    for (const [username, gigs] of Object.entries(SEED_GIGS)) {
      const { profileId } = userMap[username];
      
      // Clear existing gigs for this profile to avoid duplicates
      await client.query('DELETE FROM gigs WHERE worker_id = $1', [profileId]);

      for (const gig of gigs) {
        const gigRes = await client.query(
          `INSERT INTO gigs (worker_id, title, description, video_url, thumbnail_url, view_count, likes_count, comments_count, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
          [profileId, gig.title, gig.description, gig.video_url, gig.thumbnail_url, gig.view_count, gig.likes_count, gig.comments_count, gig.category]
        );
        console.log(`   ↳ Gig created: "${gig.title}" (${gigRes.rows[0].id})`);

        // Seed some comments from random users
        const usernames = Object.keys(userMap).filter(u => u !== username);
        const commentCount = Math.min(3, SEED_COMMENTS.length);
        for (let c = 0; c < commentCount; c++) {
          const randomUser = usernames[c % usernames.length];
          await client.query(
            'INSERT INTO gig_comments (gig_id, user_id, text) VALUES ($1, $2, $3)',
            [gigRes.rows[0].id, userMap[randomUser].userId, SEED_COMMENTS[c]]
          );
        }

        // Seed some likes from random users
        for (let l = 0; l < Math.min(4, usernames.length); l++) {
          try {
            await client.query(
              'INSERT INTO gig_likes (gig_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
              [gigRes.rows[0].id, userMap[usernames[l]].userId]
            );
          } catch (e) { /* skip duplicates */ }
        }
      }
    }

    // 4. Seed ratings
    console.log('\n⭐ Seeding ratings...');
    const allUsernames = Object.keys(userMap);
    for (const targetUsername of allUsernames) {
      const { profileId: targetProfileId } = userMap[targetUsername];
      const raters = allUsernames.filter(u => u !== targetUsername);
      
      for (let r = 0; r < Math.min(raters.length, SEED_RATINGS.length); r++) {
        const raterUserId = userMap[raters[r]].userId;
        try {
          await client.query(
            'INSERT INTO ratings (from_user_id, to_worker_id, score, comment) VALUES ($1, $2, $3, $4)',
            [raterUserId, targetProfileId, SEED_RATINGS[r % SEED_RATINGS.length], SEED_COMMENTS[r % SEED_COMMENTS.length]]
          );
        } catch (e) { /* skip */ }
      }
    }

    // 5. Seed some connections (follows)
    console.log('\n🔗 Seeding connections...');
    // Lewis follows everyone
    const lewisRes = await client.query("SELECT id FROM users WHERE username = 'lewisking2016'");
    if (lewisRes.rows.length > 0) {
      const lewisId = lewisRes.rows[0].id;
      for (const username of allUsernames) {
        try {
          await client.query(
            'INSERT INTO connections (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [lewisId, userMap[username].userId]
          );
        } catch (e) { /* skip */ }
      }
      console.log('   ↳ Lewis follows all seed users.');
    }

    // Some cross-follows between seed users
    for (let i = 0; i < allUsernames.length; i++) {
      for (let j = i + 1; j < allUsernames.length; j++) {
        try {
          await client.query(
            'INSERT INTO connections (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userMap[allUsernames[i]].userId, userMap[allUsernames[j]].userId]
          );
        } catch (e) { /* skip */ }
      }
    }

    // Done!
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEED COMPLETE — All accounts ready!');
    console.log('='.repeat(60));
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('─'.repeat(60));
    for (const user of SEED_USERS) {
      console.log(`   ${user.full_name.padEnd(20)} │ Phone: ${user.phone_number.padEnd(16)} │ Pass: ${user.password}`);
    }
    console.log('─'.repeat(60));
    console.log('\n   Your Account       │ Phone: +254114971070    │ Pass: lewisking2005');
    console.log('─'.repeat(60));

  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
