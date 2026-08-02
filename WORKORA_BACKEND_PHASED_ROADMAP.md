# Workora Backend Phased Roadmap

This document defines how the backend must evolve to support the full Workora platform.

The backend is the source of truth for identity, trust, content, search, messaging, and uploads.

## 1. Backend Goal

The backend must support:
- secure auth
- profile management
- proof-of-work content
- search and discovery
- trust scoring
- messaging
- uploads
- AI data access
- analytics
- moderation

It must remain reliable and fast for 500–1000+ active users and beyond.

## 2. Current Reality

The backend currently has:
- Fastify server setup
- JWT support
- multipart upload support
- route groups for auth, profile, gigs, messages, upload
- Postgres schema and tables

The backend still needs:
- stronger auth enforcement
- production migration discipline
- better indexing
- better query patterns
- better trust lifecycle logic

## 3. Backend Principles

- Server is source of truth
- Trust must be auditable
- Write routes must be authenticated
- Query plans matter
- Keep endpoints consistent and explicit
- Avoid startup side effects in production
- Optimize for read-heavy mobile/web traffic

## 4. Backend Layers

### Layer 1: Runtime and server bootstrap
- Server startup
- Environment loading
- DB connection setup
- Plugin registration
- Health checks

### Layer 2: Authentication and authorization
- Register
- Login
- Logout
- JWT issuance and verification
- Protected routes
- Ownership checks

### Layer 3: Core profile and identity data
- User records
- Worker profiles
- Skills
- Languages
- Experience
- Education
- Certifications
- Trust score

### Layer 4: Content and proof-of-work
- Gigs
- Stories
- Reels
- Posts
- Likes
- Comments
- Saves

### Layer 5: Discovery and search
- Feed
- Explore
- Search
- Ranking
- Filtering

### Layer 6: Messaging and conversion
- Conversations
- Messages
- Read states
- Unread counts

### Layer 7: Uploads and storage
- Avatar uploads
- Media uploads
- Public URL generation
- File validation
- R2/S3 integration

### Layer 8: Trust lifecycle
- Gig status
- Completion
- Ratings
- Badge logic
- Trust score updates

### Layer 9: AI and analytics support
- AI retrieval data
- Event capture
- Monitoring
- Moderation inputs

### Layer 10: Production readiness
- Migrations
- Indexes
- Logging
- Rate limiting
- Backpressure
- Safe deployment

## 5. Backend Feature Map

### Auth
- Register a user
- Login with token issuance
- Verify token on protected requests
- Derive authenticated user from JWT

### Profiles
- Fetch own and public profiles
- Update profile fields
- Manage skills and credentials

### Content
- Create content items
- Fetch feed and explore data
- Like and comment

### Search
- Search profiles by trade, location, and trust
- Return ranked and paginated results

### Messaging
- Create or fetch conversations
- Send messages
- Mark read
- Count unread

### Uploads
- Accept multipart uploads
- Store media
- Return public URLs

### Trust
- Track gig status
- Enforce completion before rating
- Update trust score from valid events

### Analytics
- Emit platform events
- Track funnel actions

## 6. Data and Integrity Rules

- Never trust `user_id` from the client for sensitive writes.
- Never allow ratings without a valid completed gig.
- Never allow duplicate conversations for the same user pair.
- Never allow silently broken uploads.
- Never auto-migrate schemas in production startup.
- Never use hardcoded fallback secrets in production.

## 7. Phase 0: Runtime and Safety

Goals:
- Make startup safe and predictable.
- Make health visible.

Deliverables:
- Health endpoint
- Environment validation
- DB connection validation
- Proper logging

Exit criteria:
- The server starts reliably and reports status clearly.

## 8. Phase 1: Authentication and Authorization

Goals:
- Make auth server-trusted and secure.

Deliverables:
- JWT verification middleware
- Protected route guards
- Ownership checks
- Secure secret handling

Exit criteria:
- Protected operations cannot be executed without valid auth.

## 9. Phase 2: Core Identity and Profiles

Goals:
- Store and serve real identity and reputation data.

Deliverables:
- Profile read endpoint
- Profile update endpoint
- Skills and credentials endpoints
- Trust score read endpoint

Exit criteria:
- Profiles are complete and accurate for real users.

## 10. Phase 3: Content and Feed

Goals:
- Support Instagram-style business content.

Deliverables:
- Content model for stories, reels, and posts
- Feed endpoint
- Explore endpoint
- Like and comment endpoints

Exit criteria:
- Users can create and browse proof-of-work content.

## 11. Phase 4: Search and Discovery

Goals:
- Make search relevant and fast.

Deliverables:
- Search endpoint
- Better ranking
- Pagination
- Search indexes

Exit criteria:
- Search remains useful as data grows.

## 12. Phase 5: Messaging

Goals:
- Make conversations reliable.

Deliverables:
- Deterministic conversation creation
- Message send endpoint
- Read/unread logic
- Efficient unread counters

Exit criteria:
- Chat works with acceptable latency and no duplication.

## 13. Phase 6: Uploads and Media

Goals:
- Make media uploads safe and stable.

Deliverables:
- Multipart-safe upload handling
- Avatar uploads
- Reel and thumbnail uploads
- Size limits and mime validation

Exit criteria:
- Media uploads work reliably on real networks.

## 14. Phase 7: Trust Lifecycle

Goals:
- Make trust real, not decorative.

Deliverables:
- Gig status model
- Completion confirmation
- Rating restrictions
- Trust score updates
- Badge logic

Exit criteria:
- Trust updates only from valid work outcomes.

## 15. Phase 8: Analytics and AI Support

Goals:
- Support growth and AI features.

Deliverables:
- Event logging
- AI-readable profile and content summaries
- Search/retrieval support

Exit criteria:
- The backend exposes enough real data for AI and analytics features.

## 16. Phase 9: Performance and Scale

Goals:
- Make the backend fast enough for pilots and early growth.

Deliverables:
- Index tuning
- Query optimization
- Pagination
- Caching where appropriate
- Query plan review

Exit criteria:
- Core screens and actions remain responsive under moderate load.

## 17. Phase 10: Production Hardening

Goals:
- Make the backend safe for public use.

Deliverables:
- Real migration workflow
- No startup auto-migrate in production
- Rate limiting
- Audit logging
- Monitoring
- Error handling

Exit criteria:
- The backend is stable enough for 500–1000+ users and pilot expansion.

## 18. Required Index and Query Targets

The backend should at minimum cover:
- feed sort by created time
- explore sort by view count
- profile lookup by user and trade
- search by trust and keywords
- message threads by conversation and unread state
- ratings by target worker

## 19. Definition of Done for Backend

The backend is ready when:
- auth is enforced everywhere it should be
- identity is server-derived
- feeds and search are fast
- messaging is reliable
- uploads are safe
- trust data is valid
- analytics can be captured
- startup behavior is production-safe
- the API supports the mobile and web app without workarounds

