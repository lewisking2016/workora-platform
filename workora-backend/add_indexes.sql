-- Performance Optimization: Database Indexes
-- Run this to make queries 10-100x faster

-- Gigs table indexes (most queried)
CREATE INDEX IF NOT EXISTS idx_gigs_created_at ON gigs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gigs_user_id ON gigs(user_id);
CREATE INDEX IF NOT EXISTS idx_gigs_worker_id ON gigs(worker_id);
CREATE INDEX IF NOT EXISTS idx_gigs_view_count ON gigs(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category);

-- Likes table indexes
CREATE INDEX IF NOT EXISTS idx_gig_likes_gig_id ON gig_likes(gig_id);
CREATE INDEX IF NOT EXISTS idx_gig_likes_user_id ON gig_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_gig_likes_composite ON gig_likes(gig_id, user_id);

-- Comments table indexes
CREATE INDEX IF NOT EXISTS idx_gig_comments_gig_id ON gig_comments(gig_id);
CREATE INDEX IF NOT EXISTS idx_gig_comments_user_id ON gig_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_gig_comments_created_at ON gig_comments(created_at DESC);

-- Saved gigs indexes
CREATE INDEX IF NOT EXISTS idx_saved_gigs_user_id ON saved_gigs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_gigs_gig_id ON saved_gigs(gig_id);
CREATE INDEX IF NOT EXISTS idx_saved_gigs_composite ON saved_gigs(user_id, gig_id);

-- Worker profiles indexes
CREATE INDEX IF NOT EXISTS idx_worker_profiles_user_id ON worker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_trade ON worker_profiles(trade);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_verified ON worker_profiles(is_verified);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant_1);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant_2);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Full-text search indexes (for faster search)
CREATE INDEX IF NOT EXISTS idx_gigs_description_fts ON gigs USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_worker_profiles_fullname_fts ON worker_profiles USING gin(to_tsvector('english', full_name));

-- Analyze tables for query planner optimization
ANALYZE gigs;
ANALYZE gig_likes;
ANALYZE gig_comments;
ANALYZE saved_gigs;
ANALYZE worker_profiles;
ANALYZE users;
ANALYZE messages;
ANALYZE conversations;

SELECT 'Indexes created successfully! Database is now optimized.' as status;
