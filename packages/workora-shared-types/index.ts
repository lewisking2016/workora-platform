/**
 * @workora/shared-types
 *
 * Shared domain types for the Workora platform. These mirror the API
 * contracts returned by the Fastify backend so web (Next.js) and mobile
 * (Flutter via JSON) consume the same shapes.
 */

export type UserRole = 'worker' | 'hirer' | 'admin';
export type TeamType = 'solo' | 'team';
export type SubscriptionTier = 'free' | 'elite';
export type AvailabilityStatus = 'available' | 'busy' | 'away';

export interface User {
  id: string;
  username?: string | null;
  phone_number: string;
  email?: string | null;
  role: UserRole;
  birthday?: string | null;
  team_type?: TeamType;
  subscription?: SubscriptionTier;
  created_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  full_name: string;
  display_name?: string | null;
  title?: string | null;
  trade: string;
  bio?: string | null;
  location?: string | null;
  profile_visibility?: 'public' | 'private' | 'restricted';
  account_status?: 'active' | 'suspended';
  verification_status?: 'pending' | 'verified' | 'rejected';
  availability_status?: AvailabilityStatus;
  service_areas?: string | null;
  cover_url?: string | null;
  pricing_from?: number | string;
  identity_status?: string;
  identity_document_url?: string | null;
  avatar_url?: string | null;
  voice_intro_url?: string | null;
  trust_score?: number | string;
  total_gigs?: number;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
  total_earnings?: number;
}

export type ProfileState =
  | 'not_found'
  | 'suspended'
  | 'restricted'
  | 'private'
  | 'verification_pending'
  | 'empty'
  | 'ready';

export interface ProfileBundle {
  user: User | null;
  profile: WorkerProfile | null;
  profile_state: ProfileState;
  skills: unknown[];
  languages: unknown[];
  experience: unknown[];
  education: unknown[];
  certifications: unknown[];
  portfolio: unknown[];
  ratings: unknown[];
  ratingBreakdown: unknown[];
  trustAverage: number;
  totalEarnings: number;
}

export interface Gig {
  id: string;
  worker_id?: string | null;
  user_id?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  view_count?: number;
  price?: number | string;
  created_at: string;
  // Denormalized feed fields
  user_name?: string;
  handle?: string;
  trade?: string;
  verified?: boolean;
  avatar_url?: string | null;
  creator_location?: string;
  creator_trust_score?: number | string;
  creator_user_id?: string;
  likes_count?: number;
  comments_count?: number;
  saved_by_me?: boolean;
  liked_by_me?: boolean;
  following_by_me?: boolean;
}

export type FeedScope = 'new' | 'following' | 'recommended' | 'trending' | 'nearby' | 'reels';

export interface Rating {
  id: string;
  gig_id?: string | null;
  from_user_id: string;
  to_worker_id: string;
  score: number;
  comment?: string | null;
  created_at: string;
  reviewer_username?: string;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_text?: string | null;
  last_message_at: string;
  created_at: string;
  // View helpers
  other_username?: string;
  other_user_id?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  is_muted?: boolean;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  text: string;
  is_read: boolean;
  delivery_status?: 'sent' | 'failed';
  edited_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  attachments?: Array<{
    id: string;
    file_url: string;
    file_type?: string | null;
    file_name?: string | null;
  }>;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'rating' | 'message' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  actor_id: string;
  actor_name: string;
  actor_trade?: string;
  actor_verified?: boolean;
  gig_id?: string | null;
  text: string;
  created_at: string;
  is_read: boolean;
}

export interface AuthUser {
  id: string;
  username?: string | null;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
