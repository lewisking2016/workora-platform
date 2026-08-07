require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

// Use DATABASE_URL from environment or construct from individual vars
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'your_password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'workora'}`;

console.log('🔗 Connecting to database...');
console.log('Using connection string:', connectionString.replace(/:[^:@]+@/, ':***@')); // Hide password

// Database connection
const client = new Client({
  connectionString: connectionString,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Kenyan cities and neighborhoods
const LOCATIONS = [
  'Nairobi CBD', 'Westlands', 'Kilimani', 'Parklands', 'Kasarani',
  'Embakasi', 'South B', 'South C', 'Langata', 'Karen',
  'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
  'Ruiru', 'Kikuyu', 'Ngong', 'Limuru', 'Rongai'
];

// Realistic Kenyan trades and professions (limited to available videos)
const TRADES = [
  'Plumber',
  'Electrician', 
  'Mason' // Construction work
];

// Realistic Kenyan names
const FIRST_NAMES = [
  'John', 'Mary', 'Peter', 'Jane', 'David', 'Grace', 'James', 'Lucy',
  'Michael', 'Faith', 'Daniel', 'Sarah', 'Joseph', 'Ruth', 'Samuel',
  'Esther', 'Brian', 'Ann', 'Kevin', 'Rose', 'Emmanuel', 'Joyce',
  'Patrick', 'Elizabeth', 'Francis', 'Margaret', 'George', 'Catherine',
  'Paul', 'Nancy', 'Anthony', 'Agnes', 'Dennis', 'Susan', 'Collins',
  'Mercy', 'Kenneth', 'Alice', 'Timothy', 'Beatrice', 'Victor', 'Florence',
  'Edwin', 'Rebecca', 'Martin', 'Lydia', 'Moses', 'Hannah', 'Isaac', 'Rachel'
];

const LAST_NAMES = [
  'Kamau', 'Wanjiku', 'Otieno', 'Akinyi', 'Mwangi', 'Njeri', 'Odhiambo',
  'Adhiambo', 'Kimani', 'Wambui', 'Omondi', 'Atieno', 'Gitau', 'Wangari',
  'Kipchoge', 'Chepkoech', 'Koech', 'Chebet', 'Kiplagat', 'Jepkosgei',
  'Mutua', 'Muthoni', 'Kibet', 'Jepkemoi', 'Wafula', 'Nekesa', 'Onyango',
  'Auma', 'Kariuki', 'Wangui', 'Nganga', 'Wairimu', 'Musyoka', 'Nduku',
  'Omolo', 'Apiyo', 'Macharia', 'Nyambura', 'Kimutai', 'Jelimo'
];

// Sample skills by trade (updated for available categories)
const SKILLS_BY_TRADE = {
  'Plumber': ['Pipe Fitting', 'Drain Cleaning', 'Water Heater Installation', 'Leak Repair', 'Bathroom Installation'],
  'Electrician': ['Wiring', 'Circuit Installation', 'Fault Finding', 'Solar Installation', 'Lighting Systems'],
  'Mason': ['Bricklaying', 'Concrete Work', 'Plastering', 'Block Work', 'Foundation Work'],
};

// Local video files organized by category
const VIDEO_FILES_BY_TRADE = {
  'Plumber': [
    '/videos/plumbing1.mp4',
    '/videos/plumbing2.mp4',
    '/videos/plumbing3.mp4',
    '/videos/plumbing5.mp4'
  ],
  'Electrician': [
    '/videos/electrical1.mp4',
    '/videos/electrical2.mp4',
    '/videos/electrical3.mp4',
    '/videos/electrical4.mp4',
    '/videos/electrical5.mp4'
  ],
  'Mason': [
    '/videos/construction.mp4',
    '/videos/construction2.mp4',
    '/videos/construction 3.mp4'
  ]
};

// Thumbnails from Unsplash for each category
const THUMBNAIL_BY_TRADE = {
  'Plumber': 'https://source.unsplash.com/1200x800/?plumbing,pipes',
  'Electrician': 'https://source.unsplash.com/1200x800/?electrical,wiring',
  'Mason': 'https://source.unsplash.com/1200x800/?construction,building'
};

// Realistic titles by trade
const TITLES_BY_TRADE = {
  'Plumber': [
    'Complete bathroom plumbing installation',
    'Kitchen sink and drainage system repair',
    'Water heater installation and setup',
    'Pipe leak repair and replacement',
    'Drainage system unclogging and cleaning',
    'Toilet installation and repairs',
    'Water line installation for new construction',
    'Shower and bathtub plumbing work'
  ],
  'Electrician': [
    'Complete house rewiring project',
    'Solar panel installation and connection',
    'Circuit breaker and panel upgrade',
    'LED lighting system installation',
    'Outdoor security lighting setup',
    'Fault finding and electrical repairs',
    'Generator installation and wiring',
    'Smart home electrical setup'
  ],
  'Mason': [
    'Brick wall construction for new building',
    'Concrete foundation laying work',
    'Plastering and finishing interior walls',
    'Block work for residential project',
    'Paving and compound flooring',
    'Retaining wall construction',
    'Fence and gate pillar construction',
    'Building renovation and repair work'
  ]
};

// Realistic descriptions by trade
const DESCRIPTIONS_BY_TRADE = {
  'Plumber': [
    'Professional plumbing installation completed on time. All pipes tested and certified leak-free.',
    'High-quality plumbing repair using durable materials. Work guaranteed for 6 months.',
    'Expert plumbing service for residential property. Clean work, no mess left behind.',
    'Certified plumber with 5+ years experience. Quality workmanship and fair pricing.',
  ],
  'Electrician': [
    'Licensed electrician - All work certified and tested for safety compliance.',
    'Professional electrical installation with warranty. Using genuine quality materials.',
    'Expert in residential and commercial electrical work. Fast, reliable, and affordable.',
    'Certified electrical contractor. All installations meet Kenya Power standards.',
  ],
  'Mason': [
    'Quality masonry work using certified materials. Strong and durable construction.',
    'Professional building and construction services. Over 10 years experience.',
    'Expert mason available for all types of construction projects. Fair rates.',
    'Quality brick and block work. Clean, professional finish guaranteed.',
  ]
};

// Realistic comments by trade
const COMMENTS_BY_TRADE = {
  'Plumber': [
    'Fixed my bathroom leak perfectly! No issues since then',
    'Very professional work. Came on time and finished quickly',
    'Great plumber! Fair prices and quality materials used',
    'Highly recommend. My kitchen sink works perfectly now',
    'Excellent service. Will call again for future work',
    'Clean work, no mess. Very satisfied with the plumbing',
    'Best plumber in Nairobi! Fast and reliable',
    'Quality workmanship. Water pressure is now perfect'
  ],
  'Electrician': [
    'Excellent electrical work! Everything working perfectly',
    'Very knowledgeable electrician. Solved my power issues',
    'Professional and affordable. Highly recommended',
    'Great job on the wiring. Very neat and clean work',
    'Fixed my electrical fault quickly. Thank you!',
    'Quality work on solar installation. Saving on bills now',
    'Best electrician I have worked with. Will hire again',
    'Very reliable. Completed work ahead of schedule'
  ],
  'Mason': [
    'Excellent masonry work! Wall is strong and beautiful',
    'Professional mason. Very satisfied with the construction',
    'Quality brick work. Highly recommend this mason',
    'Fast and reliable. Building looks great!',
    'Very skilled mason. Fair pricing for quality work',
    'Best mason in the area. Clean and professional',
    'Great construction work. Will hire for next project',
    'Strong foundation work. Very impressed with quality'
  ]
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhoneNumber() {
  const prefixes = ['0710', '0711', '0712', '0720', '0722', '0723', '0724', '0725', '0733', '0740', '0745', '0757'];
  return `${randomItem(prefixes)}${randomInt(100000, 999999)}`;
}

function generateUsername(firstName, lastName) {
  const rand = randomInt(10, 99);
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${rand}`;
}

function getProfileAvatar(name) {
  // Use UI Avatars for realistic profile pictures
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=random&bold=true`;
}

async function clearExistingData() {
  console.log('🗑️  Clearing existing data...');
  
  await client.query('DELETE FROM messages');
  await client.query('DELETE FROM conversations');
  await client.query('DELETE FROM ratings');
  await client.query('DELETE FROM gig_comments');
  await client.query('DELETE FROM gig_likes');
  await client.query('DELETE FROM saved_gigs');
  await client.query('DELETE FROM gigs');
  await client.query('DELETE FROM worker_certifications');
  await client.query('DELETE FROM worker_education');
  await client.query('DELETE FROM worker_experience');
  await client.query('DELETE FROM worker_skills');
  await client.query('DELETE FROM worker_languages');
  await client.query('DELETE FROM worker_profiles');
  await client.query('DELETE FROM users');
  
  console.log('✅ Existing data cleared');
}

async function createUsers(count = 50) {
  console.log(`\n👥 Creating ${count} users...`);
  const users = [];
  const passwordHash = await bcrypt.hash('password123', 10);

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);
    const username = generateUsername(firstName, lastName);
    const phoneNumber = generatePhoneNumber();
    const role = i < count * 0.8 ? 'worker' : 'hirer'; // 80% workers, 20% hirers

    const result = await client.query(
      `INSERT INTO users (username, phone_number, password_hash, role, birthday, team_type, subscription)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, role`,
      [
        username,
        phoneNumber,
        passwordHash,
        role,
        new Date(1970 + randomInt(20, 35), randomInt(0, 11), randomInt(1, 28)),
        randomItem(['solo', 'team']),
        i % 10 === 0 ? 'elite' : 'free'
      ]
    );

    users.push({ ...result.rows[0], firstName, lastName });
  }

  console.log(`✅ Created ${users.length} users`);
  return users;
}

async function createWorkerProfiles(users) {
  console.log('\n🔧 Creating worker profiles...');
  const profiles = [];

  for (const user of users) {
    if (user.role !== 'worker') continue;

    const trade = randomItem(TRADES);
    const fullName = `${user.firstName} ${user.lastName}`;
    const location = randomItem(LOCATIONS);
    const trustScore = (3.5 + Math.random() * 1.5).toFixed(2); // 3.5 - 5.0
    const totalGigs = randomInt(5, 50);

    const result = await client.query(
      `INSERT INTO worker_profiles (user_id, full_name, display_name, title, trade, bio, location, avatar_url, trust_score, total_gigs, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, user_id, full_name, trade, location`,
      [
        user.id,
        fullName,
        user.firstName,
        `Professional ${trade}`,
        trade,
        `Experienced ${trade.toLowerCase()} based in ${location}. Quality work guaranteed with ${totalGigs}+ completed projects. Available for both residential and commercial work.`,
        location,
        getProfileAvatar(fullName),
        trustScore,
        totalGigs,
        Math.random() > 0.3 // 70% verified
      ]
    );

    profiles.push(result.rows[0]);
  }

  console.log(`✅ Created ${profiles.length} worker profiles`);
  return profiles;
}

async function addSkills(profiles) {
  console.log('\n💼 Adding skills to profiles...');
  let skillCount = 0;

  for (const profile of profiles) {
    const skills = SKILLS_BY_TRADE[profile.trade] || ['General Work', 'Quality Service', 'Fast Delivery'];
    const skillsToAdd = skills.slice(0, randomInt(2, skills.length));

    for (const skill of skillsToAdd) {
      await client.query(
        `INSERT INTO worker_skills (profile_id, skill_name, skill_level)
         VALUES ($1, $2, $3)`,
        [profile.id, skill, randomItem(['intermediate', 'expert', 'master'])]
      );
      skillCount++;
    }
  }

  console.log(`✅ Added ${skillCount} skills`);
}

async function addLanguages(profiles) {
  console.log('\n🗣️  Adding languages...');
  let langCount = 0;

  for (const profile of profiles) {
    const languages = ['English', 'Swahili'];
    if (Math.random() > 0.7) languages.push(randomItem(['Kikuyu', 'Luo', 'Kalenjin', 'Kamba']));

    for (const lang of languages) {
      await client.query(
        `INSERT INTO worker_languages (profile_id, language, proficiency)
         VALUES ($1, $2, $3)`,
        [profile.id, lang, randomItem(['conversational', 'fluent', 'native'])]
      );
      langCount++;
    }
  }

  console.log(`✅ Added ${langCount} languages`);
}

async function createGigs(profiles) {
  console.log('\n📸 Creating gigs (proof of work)...');
  const gigs = [];

  for (const profile of profiles) {
    const gigCount = randomInt(4, 10);
    const tradeVideos = VIDEO_FILES_BY_TRADE[profile.trade] || VIDEO_FILES_BY_TRADE['Mason'];
    const tradeTitles = TITLES_BY_TRADE[profile.trade] || TITLES_BY_TRADE['Mason'];
    const tradeDescriptions = DESCRIPTIONS_BY_TRADE[profile.trade] || DESCRIPTIONS_BY_TRADE['Mason'];
    const tradeThumbnail = THUMBNAIL_BY_TRADE[profile.trade] || THUMBNAIL_BY_TRADE['Mason'];

    for (let i = 0; i < gigCount; i++) {
      const videoUrl = randomItem(tradeVideos);
      const title = randomItem(tradeTitles);
      const description = randomItem(tradeDescriptions);
      const thumbnailUrl = `${tradeThumbnail}&sig=${randomInt(1, 999)}`;

      const result = await client.query(
        `INSERT INTO gigs (worker_id, user_id, title, description, category, video_url, thumbnail_url, view_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          profile.id,
          profile.user_id,
          title,
          description,
          profile.trade,
          videoUrl,
          thumbnailUrl,
          randomInt(10, 500)
        ]
      );

      gigs.push({ ...result.rows[0], trade: profile.trade });
    }
  }

  console.log(`✅ Created ${gigs.length} gigs`);
  return gigs;
}

async function addEngagement(gigs, users) {
  console.log('\n❤️  Adding likes and comments...');
  let likeCount = 0;
  let commentCount = 0;

  for (const gig of gigs) {
    // Get trade-specific comments
    const tradeComments = COMMENTS_BY_TRADE[gig.trade] || COMMENTS_BY_TRADE['Mason'];
    
    // Add random likes
    const likers = users.slice(0, randomInt(5, 30));
    for (const liker of likers) {
      try {
        await client.query(
          `INSERT INTO gig_likes (gig_id, user_id) VALUES ($1, $2)`,
          [gig.id, liker.id]
        );
        likeCount++;
      } catch (err) {
        // Ignore duplicate likes
      }
    }

    // Add random trade-relevant comments
    const commenters = users.slice(0, randomInt(3, 8));
    for (const commenter of commenters) {
      await client.query(
        `INSERT INTO gig_comments (gig_id, user_id, text) VALUES ($1, $2, $3)`,
        [gig.id, commenter.id, randomItem(tradeComments)]
      );
      commentCount++;
    }
  }

  console.log(`✅ Added ${likeCount} likes and ${commentCount} comments`);
}

async function addRatings(profiles, users) {
  console.log('\n⭐ Adding ratings...');
  let ratingCount = 0;

  const reviewComments = [
    'Excellent service! Very professional and on time.',
    'Great quality work. Would recommend to anyone.',
    'Very satisfied with the work done. Will use again.',
    'Professional and skilled. Fair pricing.',
    'Outstanding work! Exceeded expectations.',
    'Reliable and trustworthy. Great communication.',
    'High quality work completed on schedule.',
    'Very pleased with the results. Highly recommended.',
  ];

  for (const profile of profiles) {
    const reviewCount = randomInt(5, 15);
    for (let i = 0; i < reviewCount; i++) {
      const reviewer = randomItem(users);
      await client.query(
        `INSERT INTO ratings (from_user_id, to_worker_id, score, comment)
         VALUES ($1, $2, $3, $4)`,
        [reviewer.id, profile.id, randomInt(4, 5), randomItem(reviewComments)]
      );
      ratingCount++;
    }
  }

  console.log(`✅ Added ${ratingCount} ratings`);
}

async function main() {
  try {
    await client.connect();
    console.log('🚀 Starting realistic data seeding...\n');

    await clearExistingData();
    
    const users = await createUsers(50);
    const profiles = await createWorkerProfiles(users);
    await addSkills(profiles);
    await addLanguages(profiles);
    const gigs = await createGigs(profiles);
    await addEngagement(gigs, users);
    await addRatings(profiles, users);

    console.log('\n✨ Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${users.length} users created`);
    console.log(`   - ${profiles.length} worker profiles`);
    console.log(`   - ${gigs.length} gigs/posts`);
    console.log(`   - All with realistic Kenyan names, locations, and trades`);
    console.log(`   - Test login: any username with password "password123"`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
