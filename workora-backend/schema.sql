-- Workora Database Schema
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
    profile_visibility TEXT DEFAULT 'public',
    account_status TEXT DEFAULT 'active',
    verification_status TEXT DEFAULT 'pending',
    availability_status TEXT DEFAULT 'available',
    service_areas TEXT,
    cover_url TEXT,
    pricing_from DECIMAL(10, 2) DEFAULT 0.0,
    identity_status TEXT DEFAULT 'unverified',
    identity_document_url TEXT,
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
    description TEXT,
    category TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Gig Likes
CREATE TABLE IF NOT EXISTS gig_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gig_id, user_id)
);

-- 10. Gig Comments
CREATE TABLE IF NOT EXISTS gig_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10b. Saved Gigs
CREATE TABLE IF NOT EXISTS saved_gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gig_id, user_id)
);

-- 10c. Social Graph
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_user_id)
);

CREATE TABLE IF NOT EXISTS user_mutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    muted_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, muted_user_id)
);

CREATE TABLE IF NOT EXISTS user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_user_id)
);

CREATE TABLE IF NOT EXISTS gig_hides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, gig_id)
);

CREATE TABLE IF NOT EXISTS gig_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10d. Collections
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    kind TEXT DEFAULT 'custom',
    is_public BOOLEAN DEFAULT TRUE,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('gig', 'profile')),
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(collection_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    draft_type TEXT NOT NULL CHECK (draft_type IN ('post', 'reel', 'story', 'gig', 'proof')),
    title TEXT,
    description TEXT,
    media_url TEXT,
    thumbnail_url TEXT,
    trade TEXT,
    location TEXT,
    audience TEXT DEFAULT 'public',
    status TEXT DEFAULT 'draft',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, profile_id)
);

CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, query)
);

CREATE TABLE IF NOT EXISTS profile_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Ratings & Reviews
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE SET NULL,
    from_user_id UUID REFERENCES users(id),
    to_worker_id UUID REFERENCES worker_profiles(id),
    score INTEGER CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11b. Auth login attempts
CREATE TABLE IF NOT EXISTS auth_login_attempts (
    identifier TEXT PRIMARY KEY,
    failed_count INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_failed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Safe column additions (won't error if they already exist)
DO $$ BEGIN
    -- Legacy schema_v2 conversations used participant_a/participant_b.
    -- Add the current participant_1/participant_2 columns and backfill them.
    ALTER TABLE conversations ADD COLUMN IF NOT EXISTS participant_1 UUID REFERENCES users(id) ON DELETE CASCADE;
    ALTER TABLE conversations ADD COLUMN IF NOT EXISTS participant_2 UUID REFERENCES users(id) ON DELETE CASCADE;
    UPDATE conversations
       SET participant_1 = COALESCE(participant_1, participant_a),
           participant_2 = COALESCE(participant_2, participant_b)
     WHERE participant_1 IS NULL AND participant_a IS NOT NULL;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS birthday DATE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS team_type TEXT DEFAULT 'solo';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription TEXT DEFAULT 'free';
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS title TEXT;
    ALTER TABLE gigs ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE gigs ADD COLUMN IF NOT EXISTS category TEXT;
    ALTER TABLE gigs ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0.0;
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public';
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS service_areas TEXT;
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS cover_url TEXT;
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS pricing_from DECIMAL(10, 2) DEFAULT 0.0;
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS identity_status TEXT DEFAULT 'unverified';
    ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS identity_document_url TEXT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'sent';
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
    -- Legacy schema_v2 messages had no attachment support; table is created separately.
    ALTER TABLE auth_login_attempts ADD COLUMN IF NOT EXISTS failed_count INTEGER DEFAULT 0;
    ALTER TABLE auth_login_attempts ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
    ALTER TABLE auth_login_attempts ADD COLUMN IF NOT EXISTS last_failed_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE auth_login_attempts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS likes_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS comments_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS follows_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS mentions_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS messages_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS trust_updates_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS system_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS push_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE notification_preferences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    -- Legacy analytics_events predates the session/page fields the API writes.
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS session_id TEXT;
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS page_path TEXT;
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS screen_name TEXT;
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS section TEXT;
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS element TEXT;
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS referrer TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 12. Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1 UUID REFERENCES users(id) ON DELETE CASCADE,
    participant_2 UUID REFERENCES users(id) ON DELETE CASCADE,
    last_message_text TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant_1, participant_2)
);

CREATE TABLE IF NOT EXISTS conversation_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_muted BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, user_id)
);

-- 13. Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    delivery_status TEXT DEFAULT 'sent',
    edited_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    source_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_type, source_id)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    likes_enabled BOOLEAN DEFAULT TRUE,
    comments_enabled BOOLEAN DEFAULT TRUE,
    follows_enabled BOOLEAN DEFAULT TRUE,
    mentions_enabled BOOLEAN DEFAULT TRUE,
    messages_enabled BOOLEAN DEFAULT TRUE,
    trust_updates_enabled BOOLEAN DEFAULT TRUE,
    system_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    page_path TEXT NOT NULL,
    screen_name TEXT,
    section TEXT,
    element TEXT,
    referrer TEXT,
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial pricing
INSERT INTO system_settings (key, value) 
VALUES ('pro_plus_price', '{"amount": 300, "currency": "Ksh", "interval": "month"}')
ON CONFLICT (key) DO NOTHING;

-- Indexing for search performance
CREATE INDEX IF NOT EXISTS idx_worker_trade ON worker_profiles(trade);
CREATE INDEX IF NOT EXISTS idx_gig_worker ON gigs(worker_id);
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_worker_skills ON worker_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_worker_lang ON worker_languages(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conv_participants ON conversations(participant_1, participant_2);
CREATE INDEX IF NOT EXISTS idx_saved_gigs_user ON saved_gigs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_user_id);
CREATE INDEX IF NOT EXISTS idx_user_mutes_user ON user_mutes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker ON user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_gig_hides_user ON gig_hides(user_id);
CREATE INDEX IF NOT EXISTS idx_gig_reports_gig ON gig_reports(gig_id);
CREATE INDEX IF NOT EXISTS idx_collections_owner ON collections(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_collections_kind ON collections(kind);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_post_drafts_owner ON post_drafts(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_saved_profiles_user ON saved_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_saves_user ON collection_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_reports_reported ON profile_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics_events(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
