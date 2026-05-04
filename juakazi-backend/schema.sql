-- JuaKazi Database Schema

-- 1. Users Table (Core Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('worker', 'hirer', 'admin')) DEFAULT 'worker',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Worker Profiles (Detailed Reputation)
CREATE TABLE IF NOT EXISTS worker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    trade TEXT NOT NULL, -- e.g., 'Master Electrician'
    bio TEXT,
    location TEXT,
    avatar_url TEXT,
    voice_intro_url TEXT,
    trust_score DECIMAL(3, 2) DEFAULT 0.0, -- e.g., 4.85
    total_gigs INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Gigs / Proof of Work (The Video Feed)
CREATE TABLE IF NOT EXISTS gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL, -- HLS stream URL
    thumbnail_url TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ratings & Reviews
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE SET NULL,
    from_user_id UUID REFERENCES users(id),
    to_worker_id UUID REFERENCES worker_profiles(id),
    score INTEGER CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for search performance
CREATE INDEX IF NOT EXISTS idx_worker_trade ON worker_profiles(trade);
CREATE INDEX IF NOT EXISTS idx_gig_worker ON gigs(worker_id);
