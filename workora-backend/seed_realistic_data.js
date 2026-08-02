const { Client } = require('pg');
const bcrypt = require('bcrypt');

// Use DATABASE_URL from environment or construct from individual vars
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'your_password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'workora'}`;

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

// Realistic Kenyan trades and professions
const TRADES = [
  'Plumber', 'Electrician', 'Carpenter', 'Mason', 'Painter',
  'Mechanic', 'Welder', 'Tailor', 'Barber', 'Hair Stylist',
  'Chef', 'Cleaner', 'Gardener', 'Security Guard', 'Driver',
  'Phone Repair Technician', 'Computer Technician', 'Motorcycle Mechanic',
  'Shoe Cobbler', 'Upholstery Worker', 'Roofer', 'Tiler',
  'HVAC Technician', 'Generator Technician', 'Solar Panel Installer'
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

// Sample skills by trade
const SKILLS_BY_TRADE = {
  'Plumber': ['Pipe Fitting', 'Drain Cleaning', 'Water Heater Installation', 'Leak Repair'],
  'Electrician': ['Wiring', 'Circuit Installation', 'Fault Finding', 'Solar Installation'],
  'Carpenter': ['Furniture Making', 'Door Installation', 'Cabinet Making', 'Wood Finishing'],
  'Mason': ['Bricklaying', 'Concrete Work', 'Plastering', 'Block Work'],
  'Painter': ['Interior Painting', 'Exterior Painting', 'Spray Painting', 'Wall Preparation'],
  'Mechanic': ['Engine Repair', 'Brake Systems', 'Transmission', 'Diagnostics'],
  'Welder': ['Arc Welding', 'MIG Welding', 'Metal Fabrication', 'Steel Work'],
  'Tailor': ['Dress Making', 'Suit Tailoring', 'Alterations', 'Custom Fitting'],
  'Barber': ['Haircuts', 'Shaving', 'Beard Styling', 'Hair Coloring'],
  'Chef': ['African Cuisine', 'Baking', 'Catering', 'Menu Planning'],
  'Phone Repair Technician': ['Screen Replacement', 'Battery Replacement', 'Software Repair', 'Water Damage Repair'],
  'Computer Technician': ['Hardware Repair', 'Software Installation', 'Network Setup', 'Data Recovery'],
};

// Unsplash image categories for realistic photos
const UNSPLASH_CATEGORIES = {
  'Plumber': 'plumbing-tools',
  'Electrician': 'electrical-work',
  'Carpenter': 'carpentry-woodwork',
  'Mason': 'construction-brick',
  'Painter': 'painting-wall',
  'Mechanic': 'car-mechanic',
  'Welder': 'welding-metal',
  'Tailor': 'sewing-tailoring',
  'Barber': 'barbershop',
  'Chef': 'cooking-chef',
  'Phone Repair Technician': 'phone-repair',
  'Computer Technician': 'computer-repair',
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

function getUnsplashImage(category, width = 800, height = 600) {
  return `https://source.unsplash.com/${width}x${height}/?${category}&sig=${randomInt(1, 999)}`;
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
    const gigCount = randomInt(3, 12);

    for (let i = 0; i < gigCount; i++) {
      const category = UNSPLASH_CATEGORIES[profile.trade] || 'work';
      const videoUrl = `https://storage.googleapis.com/workora-media/sample-work-${randomInt(1, 20)}.mp4`;
      const thumbnailUrl = getUnsplashImage(category, 1200, 800);

      const titles = [
        `${profile.trade} work in ${profile.location}`,
        `Quality ${profile.trade.toLowerCase()} service`,
        `Professional ${profile.trade.toLowerCase()} project`,
        `${profile.trade} installation completed`,
        `Before & after ${profile.trade.toLowerCase()} work`,
        `${profile.trade} repair service`,
        `Commercial ${profile.trade.toLowerCase()} project`,
        `Residential ${profile.trade.toLowerCase()} work`
      ];

      const result = await client.query(
        `INSERT INTO gigs (worker_id, title, description, category, video_url, thumbnail_url, view_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          profile.id,
          randomItem(titles),
          `Professional ${profile.trade.toLowerCase()} work completed in ${profile.location}. High quality materials used.`,
          profile.trade,
          videoUrl,
          thumbnailUrl,
          randomInt(10, 500)
        ]
      );

      gigs.push(result.rows[0]);
    }
  }

  console.log(`✅ Created ${gigs.length} gigs`);
  return gigs;
}

async function addEngagement(gigs, users) {
  console.log('\n❤️  Adding likes and comments...');
  let likeCount = 0;
  let commentCount = 0;

  const comments = [
    'Great work! Highly recommended',
    'Very professional service',
    'Excellent quality',
    'Fast and reliable',
    'Will hire again',
    'Top notch work',
    'Very satisfied with the service',
    'Affordable and quality',
    'Best in the business',
    'Highly skilled professional'
  ];

  for (const gig of gigs) {
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

    // Add random comments
    const commenters = users.slice(0, randomInt(2, 8));
    for (const commenter of commenters) {
      await client.query(
        `INSERT INTO gig_comments (gig_id, user_id, text) VALUES ($1, $2, $3)`,
        [gig.id, commenter.id, randomItem(comments)]
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
