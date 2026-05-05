-- JuaKazi Database Schema
-- Auto-migrated on every server startup

-- 1. Users Table (Core Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('worker', 'hirer', 'admin')) DEFAULT 'worker',
    birthday DATE,
    team_type TEXT CHECK (team_type IN ('solo', 'team')) DEFAULT 'solo',
    subscription TEXT CHECK (subscription IN ('free', 'elite')) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Worker Profiles (Detailed Reputation)
CREATE TABLE IF NOT EXISTS worker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    display_name TEXT,
    title TEXT,
    trade TEXT NOT NULL,
    bio TEXT,
    location TEXT DEFAULT 'Kenya',
    avatar_url TEXT,
    voice_intro_url TEXT,
    trust_score DECIMAL(3, 2) DEFAULT 0.0,
    total_gigs INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Worker Languages
CREATE TABLE IF NOT EXISTS worker_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    proficiency TEXT CHECK (proficiency IN ('basic', 'conversational', 'fluent', 'native')) DEFAULT 'conversational',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Worker Skills
CREATE TABLE IF NOT EXISTS worker_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_level TEXT CHECK (skill_level IN ('novice', 'intermediate', 'expert', 'master')) DEFAULT 'intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Work Experience
CREATE TABLE IF NOT EXISTS worker_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role_title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Education
CREATE TABLE IF NOT EXISTS worker_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Certifications
CREATE TABLE IF NOT EXISTS worker_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    cert_name TEXT NOT NULL,
    issuing_org TEXT,
    issue_date DATE,
    expiry_date DATE,
    credential_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Gigs / Proof of Work (The Video Feed)
CREATE TABLE IF NOT EXISTS gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Ratings & Reviews
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE SET NULL,
    from_user_id UUID REFERENCES users(id),
    to_worker_id UUID REFERENCES worker_profiles(id),
    score INTEGER CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Safe column additions (won't error if they already exist)
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS birthday DATE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS team_type TEXT DEFAULT 'solo';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription TEXT DEFAULT 'free';
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS title TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Indexing for search performance
CREATE INDEX IF NOT EXISTS idx_worker_trade ON worker_profiles(trade);
CREATE INDEX IF NOT EXISTS idx_gig_worker ON gigs(worker_id);
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_worker_skills ON worker_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_worker_lang ON worker_languages(profile_id);
