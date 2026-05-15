-- Workora Schema V2 — Social Layer
-- Run AFTER schema.sql (additive only)

-- 1. Gig Likes
CREATE TABLE IF NOT EXISTS gig_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gig_id, user_id)
);

-- 2. Gig Comments
CREATE TABLE IF NOT EXISTS gig_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Saved/Bookmarked Gigs
CREATE TABLE IF NOT EXISTS saved_gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gig_id, user_id)
);

-- 4. Connections (Follow System)
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- 5. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type TEXT CHECK (type IN ('like', 'comment', 'follow', 'rating', 'message', 'system')) NOT NULL,
    entity_id UUID,
    text TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_a UUID REFERENCES users(id) ON DELETE CASCADE,
    participant_b UUID REFERENCES users(id) ON DELETE CASCADE,
    last_message_text TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant_a, participant_b)
);

-- 7. Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Safe additions to existing gigs table
DO $$ BEGIN
    ALTER TABLE gigs ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE gigs ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
    ALTER TABLE gigs ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
    ALTER TABLE gigs ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'video';
    ALTER TABLE gigs ADD COLUMN IF NOT EXISTS category TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_gig_likes_gig ON gig_likes(gig_id);
CREATE INDEX IF NOT EXISTS idx_gig_likes_user ON gig_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_gig_comments_gig ON gig_comments(gig_id);
CREATE INDEX IF NOT EXISTS idx_saved_gigs_user ON saved_gigs(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_follower ON connections(follower_id);
CREATE INDEX IF NOT EXISTS idx_connections_following ON connections(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_gigs_created ON gigs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category);
