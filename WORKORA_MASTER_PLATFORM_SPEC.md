# Workora Master Platform Spec

This document is the source of truth for building Workora end to end.

It is intended for humans and AI coding models that will work on the platform.
If any code, UI, API, or database change conflicts with this file, this file wins.

## 1. Product Vision

Workora is the African evolution of Angi / Angie's List, but with the feeling of Instagram.

The platform should combine:
- Instagram-style content discovery
- Angi-style trust, matching, quotes, and reputation
- WhatsApp-style messaging
- AI-assisted matching, search, and job scoping

The product is for service businesses, tradespeople, freelancers, and customers who want to find, trust, contact, and hire real people quickly.

The platform must feel:
- Visual
- Fast
- Trustworthy
- Local
- Mobile-first
- Business-focused
- AI-assisted

The core idea:
- People should be able to show proof of work like stories, reels, and posts
- Other people should be able to search, compare, trust, chat, and hire
- AI should help reduce the time between "I need something" and "I found the right person"

## 2. Product Positioning

Workora is not a generic social app.
Workora is not just a directory.
Workora is not just a chat app.

Workora is:
- A business creator platform
- A trust and reputation marketplace
- A local service discovery engine
- A job conversion system
- An AI assistant for hiring and selling services

The final user experience should feel like:
- Instagram for business identity and proof-of-work
- Angi for trust and service discovery
- WhatsApp for communication
- ChatGPT for guided assistance

## 3. Non-Negotiable Rules

These rules apply to every module:

### 3.1 No demo mode
- Never serve fake feeds, fake profiles, fake messages, or fake trust data in production flows.
- Every screen must be backed by real backend data.
- Every action must persist to the backend.
- The UI must refresh from actual backend responses.

### 3.2 Server is source of truth
- Client-supplied user IDs must not be trusted for protected operations.
- Identity must come from JWT/session-derived server context.
- Ownership must be checked on the backend.

### 3.3 Fast by default
- Avoid heavy request chains on page load.
- Avoid unbounded lists without pagination.
- Avoid repeated full fetches where cached or server-rendered data will do.
- Avoid large in-memory file buffering for uploads where streaming is possible.

### 3.4 AI must assist, not invent
- AI should summarize, compare, recommend, and help scope tasks.
- AI must not fabricate trust, reviews, or job completion.
- AI suggestions must be grounded in real platform data.

### 3.5 Mobile first
- Most users will experience Workora on mobile.
- Every feature must work well on small screens and weaker networks.
- Images and videos must degrade gracefully.

## 4. Current Repo Reality

This section describes the current codebase state as of this spec.

### 4.1 Top-level structure
- `workora-web` is the Next.js web app.
- `workora-backend` is the Fastify + Postgres API.
- `workora-app` is the Flutter mobile app.

### 4.2 Current validation status
- `workora-web` builds successfully.
- `workora-app` passes `flutter analyze`.
- The backend still needs production hardening and performance tuning.

### 4.3 Existing docs
- `MODULES_TO_DEBUG_AND_BUILD.md` defines the module roadmap.
- `READY_FOR_PITCH.md` defines the pitch readiness roadmap.
- This file merges both into one build contract.

## 5. Tech Stack

### 5.1 Web
- Next.js app router
- React 19
- Tailwind CSS 4
- Framer Motion
- Next API route proxies for backend access

### 5.2 Backend
- Node.js
- Fastify
- PostgreSQL
- JWT authentication
- Multipart uploads
- Cloudflare R2 compatible storage

### 5.3 Mobile
- Flutter
- Dart
- Secure token storage
- API client abstraction
- App state container

### 5.4 Storage
- Cloudflare R2 or compatible S3 storage
- Public URLs for avatars and media

### 5.5 Planned AI layer
- AI chat assistant
- Search and matching assistant
- Business content assistant
- Job scoping assistant

## 6. Current Implementation Map

### 6.1 Web app routes
Current web app surfaces include:
- Landing and marketing pages
- Login and join pages
- Profile pages
- Trust page
- Help, safety, privacy, terms pages
- Dashboard pages for:
  - feed
  - explore
  - search
  - messages
  - create
  - works
  - analytics
  - saved
  - pro
  - notifications

### 6.2 Web API routes
Current web proxy routes include:
- `/api/auth/[...slug]`
- `/api/gigs/[...slug]`
- `/api/messages/[...slug]`
- `/api/profile/[...slug]`
- `/api/search`
- `/api/upload`

### 6.3 Backend routes
Current backend route groups:
- `/auth`
- `/profile`
- `/gigs`
- `/messages`
- `/upload`

### 6.4 Mobile scaffold
Current Flutter code includes:
- `main.dart`
- `api_client.dart`
- `auth_repository.dart`
- `token_store.dart`
- `auth_models.dart`
- `app_state.dart`
- `constants.dart`

The Flutter app is currently scaffolded, but it must be replaced with real Workora screens.

## 7. Platform Layers

The platform should be built in layers. Each layer below includes:
- What it is
- What it must do
- How it should be implemented
- What is currently missing

---

## 7.1 Layer 1: Identity and Authentication

### Purpose
Make sure every user action is tied to a verified identity.

### Must support
- Register
- Login
- Logout
- Token storage
- Current user loading
- Role awareness
- Owner validation

### How it should be made
- Backend issues JWT on login and register.
- Web stores JWT in an httpOnly cookie.
- Flutter stores JWT in secure storage.
- Every protected request uses the token automatically.
- Backend reads identity from the JWT, not from request body IDs.

### Current state
- Web proxy reads a token cookie and forwards auth.
- Flutter has secure token storage scaffolding.
- Backend currently accepts client-supplied IDs in several write routes and must be hardened.

### Required work
- Add JWT verification middleware to protected routes.
- Create a shared `me` concept on backend.
- Refactor all write operations to use authenticated user identity.
- Remove hardcoded fallback JWT secret from production.

---

## 7.2 Layer 2: Profiles and Reputation Identity

### Purpose
Represent each professional clearly and credibly.

### Must support
- Full name
- Display name
- Trade/service category
- Bio
- Location
- Avatar
- Voice intro
- Trust score
- Verified badge
- Skills
- Languages
- Experience
- Education
- Certifications
- Ratings

### How it should be made
- Profile data lives in Postgres.
- Profile pages read from backend by user ID or username.
- Updates are written through authenticated routes.
- Trust score is calculated from completed work and ratings.

### Current state
- Backend has profile tables and endpoints.
- Search and profile loading exist.
- Trust score exists, but the trust model is still too simplistic and should be tied to completed gigs and rating integrity.

### Required work
- Add owner checks to profile updates.
- Add missing profile summary and trust data endpoints where needed.
- Improve profile query performance.
- Ensure profile screens refresh after mutation.

---

## 7.3 Layer 3: Proof-of-Work Content System

### Purpose
Make Workora feel like a creator platform for businesses.

### Content types
- Story
- Reel
- Post
- Portfolio item
- Before/after media
- Testimonial post
- Project case study
- Job completion proof

### How it should be made
- Stories should be short, vertical, and ephemeral or semi-ephemeral.
- Reels should be short-form vertical video.
- Posts should be richer project updates, testimonials, and business highlights.
- Content should always connect back to a worker, business, or profile.

### Current state
- Current backend has a `gigs` table that acts like proof-of-work media.
- Current feed and explore pages already exist in web.
- The product does not yet have a full Instagram-like content model.

### Required work
- Add explicit content type fields or separate tables.
- Add story lifecycle and expiry behavior.
- Add reel and post metadata.
- Add visible trust linkage to content.
- Add composer UI that is optimized for mobile posting.

---

## 7.4 Layer 4: Feed and Discovery

### Purpose
Show the best content quickly and keep users scrolling.

### Must support
- Home feed
- Explore feed
- Profile feed
- Saved content
- Trending content
- Recent content
- Verified work content

### How it should be made
- Vertical feed layout on mobile.
- Media preloading for the next item.
- Pagination or infinite scroll.
- Caching or revalidation for read-heavy queries.
- Feed ranking based on recency, trust, relevance, and engagement.

### Current state
- Feed and explore routes exist.
- Current feed query includes counts and simple ordering.
- Search page was corrected to use search endpoint rather than feed data.

### Required work
- Add pagination/cursor loading.
- Reduce correlated count subqueries.
- Add feed ranking signals.
- Add optimistic UI for likes/comments.
- Add reel playback strategy that pauses when off-screen.

### Important performance notes
- Avoid fetching feed, stories, and suggestions all at once if not needed.
- Add in-memory or server-side caching where appropriate.
- Add indexes for sorting fields.

---

## 7.5 Layer 5: Search and Matching

### Purpose
Help hirers find the right business fast.

### Must support
- Search by trade
- Search by location
- Search by skill
- Search by rating/trust
- Search by availability
- Search by budget or project type

### How it should be made
- Search page should call the search API directly.
- Backend should rank by trust and relevance.
- Search should support broad discovery and filtered refinement.
- Search results should be quick, concise, and actionable.

### Current state
- Backend has `/profile/search`.
- Web now uses `/api/search`.
- Current backend search uses `ILIKE`, which is easy to start with but will not scale well.

### Required work
- Add trigram or full-text search.
- Add search indexes.
- Add debounce on the client.
- Add pagination or load more.
- Add location-aware ranking.

### Angi-inspired behavior
- Search should feel like "match me with the right pro."
- Users should be able to compare multiple pros and request quotes.

---

## 7.6 Layer 6: Trust, Verification, and Reputation

### Purpose
Make Workora credible.

### Must support
- Verified completed job
- Verified review
- Trust score
- Badge system
- Possibly license or background verification for some categories
- Anti-spoofing and anti-duplication

### How it should be made
- Trust score should be derived from real work.
- Ratings should only count when the underlying gig is valid.
- Completion status should be explicit.
- Repeated spam or duplicate actions should be blocked.

### Current state
- Ratings exist.
- Trust score updates exist.
- The platform does not yet enforce a complete gig lifecycle.

### Required work
- Add gig status model:
  - requested
  - accepted
  - in_progress
  - completed
  - cancelled
- Prevent ratings unless a gig is completed.
- Ensure trust updates are deterministic.
- Add anti-duplication for likes, ratings, and conversation creation.

### Angi-inspired behavior
- Verified reviews matter.
- Trust should be visible and easy to understand.
- Users should know why a pro is recommended.

---

## 7.7 Layer 7: Messaging and Conversion

### Purpose
Turn discovery into real business conversations.

### Must support
- Conversation list
- New conversation
- Message thread
- Send message
- Read receipts
- Unread counts
- Thread pagination

### How it should be made
- Conversations should be deterministic and unique per pair of users.
- Messages should be stored in Postgres.
- Read state should be updated reliably.
- Unread counts should be efficient.

### Current state
- Messaging backend exists.
- Web messaging page exists.
- Query patterns still need performance tuning.

### Required work
- Add composite indexes for conversation and unread queries.
- Enforce auth on message creation and reading.
- Prevent duplicate conversations.
- Add polling or websockets if needed later.

### Business role
Messaging is the conversion bridge between discovery and hiring.

---

## 7.8 Layer 8: Uploads and Media Pipeline

### Purpose
Handle avatars, reels, thumbnails, and attachments safely and quickly.

### Must support
- Avatar uploads
- Story media uploads
- Reel uploads
- Thumbnail uploads
- File validation
- Size limits
- Public media URLs

### How it should be made
- Browser can upload directly or through a safe presign flow.
- Backend validates file type and size.
- Uploads should not break when body is multipart or non-JSON.
- Media URLs should be public and fast to load.

### Current state
- Backend upload route exists.
- Web has an upload proxy and presign logic.
- Proxy handling was hardened for non-JSON bodies.

### Required work
- Prefer streaming for large media where possible.
- Avoid buffering large files into memory if load grows.
- Validate content type and file size.
- Add progress and retry states on the client.

### Important implementation note
- Do not force multipart through a JSON-only proxy.
- Upload routes must stay multipart-safe.

---

## 7.9 Layer 9: AI Assistance

### Purpose
Help people get what they want faster and with less friction.

### AI should help with
- Explaining what the user needs
- Turning vague requests into structured jobs
- Suggesting the right trade or professional
- Comparing pros
- Summarizing profiles
- Estimating timelines and costs
- Drafting quote requests
- Suggesting content captions and posts
- Helping workers improve their profile or content

### How it should be made
- AI should sit on top of real platform data.
- AI should use the user's current context.
- AI should not invent trust signals or fake availability.
- AI should be able to ask clarifying questions.
- AI should be able to hand off to search, chat, booking, or profile views.

### Angi inspiration
- Angi is moving toward AI-assisted project discovery and matching.
- Workora should do the same, but for African service businesses and creators.

### Recommended AI entry points
- Floating assistant on search screens
- AI prompt in home feed
- AI "describe your project" form
- AI summary on profile pages
- AI compare mode for search results

---

## 7.10 Layer 10: Analytics, Monitoring, and Moderation

### Purpose
Measure growth, protect trust, and debug issues.

### Must support
- Signup tracking
- Profile completion tracking
- Gig publish tracking
- Trust card view tracking
- Message sent tracking
- Rating submitted tracking
- Error logging
- Latency monitoring
- Spam reporting
- Moderation actions

### How it should be made
- Capture events in backend or analytics service.
- Build a simple admin dashboard.
- Log failed uploads and slow routes.
- Track funnel conversion from view to contact to completion.

### Required work
- Add event hooks to core user actions.
- Add rate limiting on post/search/message endpoints.
- Add moderation tools for spam and abuse.

---

## 7.11 Layer 11: Web App

### Purpose
Provide a strong browser experience for discovery, trust, and admin-style workflows.

### Current web responsibilities
- Marketing pages
- Login/register flows
- Dashboard
- Feed
- Explore
- Search
- Messages
- Profile
- Create
- Analytics
- Saved items
- Trust information

### How it should be made
- Use backend-backed data everywhere.
- Use server components where it helps.
- Use client components only when interactive.
- Keep proxy routes strict and predictable.
- Make the mobile web experience polished.

### Current state
- Build passes.
- Proxy is hardened.
- Search is wired to the correct backend endpoint.

### Required work
- Add feed pagination.
- Improve page-level caching and revalidation.
- Ensure auth flows are consistent.
- Remove any stale localStorage-only identity assumptions.

---

## 7.12 Layer 12: Mobile App

### Purpose
This is the main consumer and creator app for Workora.

### Current state
- The app compiles, but the entrypoint is still the default Flutter demo counter.
- The app has foundational auth, token storage, and API client scaffolding.
- The app does not yet implement the actual Workora experience.

### Must become
- A real mobile marketplace and creator app
- Not a template demo

### Required mobile modules
- Auth
- Feed
- Stories
- Reels
- Post composer
- Profile
- Search
- Messages
- Trust card
- Uploads
- Notifications
- AI assistant

### How it should be made
- Replace `main.dart` with a real app shell.
- Add routing and navigation for core modules.
- Use the API client and secure token store.
- Keep state minimal and derived from backend responses.
- Build mobile-first UI patterns for vertical content.

### Current scaffolding already present
- API client
- Auth repository
- Token storage
- App state object
- Auth models

### Required work
- Create real pages for the business feed, profile, chat, search, and upload flows.
- Store and attach auth tokens securely.
- Implement proper refresh and error handling.

---

## 8. Data Model

The data model should support creator-style content plus marketplace trust.

### 8.1 Core entities
- `users`
- `worker_profiles`
- `worker_skills`
- `worker_languages`
- `worker_experience`
- `worker_education`
- `worker_certifications`
- `gigs`
- `gig_likes`
- `gig_comments`
- `ratings`
- `conversations`
- `messages`

### 8.2 Recommended future entities
- `stories`
- `posts`
- `reels`
- `saved_items`
- `job_requests`
- `gig_status_history`
- `verification_badges`
- `reports`
- `notifications`
- `analytics_events`
- `ai_interactions`

### 8.3 Relationships
- A user can own one profile.
- A profile can have many skills, languages, experience items, education items, and certifications.
- A profile can publish many gigs, reels, posts, and stories.
- A gig can receive likes, comments, and ratings.
- A conversation belongs to two users.
- A message belongs to a conversation and a sender.

### 8.4 Important data rules
- Use UUIDs consistently.
- Use timestamps consistently.
- Keep trust-related data auditable.
- Do not let the client authoritatively set ownership fields.

---

## 9. Current Backend Concerns

These are the main backend issues that still block a production-ready platform.

### 9.1 Auth and security
- Protected routes still trust request body IDs in some cases.
- JWT middleware must be enforced consistently.
- The JWT secret must not fall back to a hardcoded value in production.

### 9.2 Startup behavior
- Auto-migration currently runs on startup.
- That is acceptable for early development only.
- Production should use real migrations and safe deployment procedures.

### 9.3 Query performance
- Feed query uses per-row count subqueries.
- Explore query sorts by view count.
- Search uses ILIKE substring matching.
- Messaging unread counts use subqueries.

### 9.4 Missing scale features
- Pagination or cursor-based loading
- Caching for hot read endpoints
- Better ranking strategy
- Better indexes for real query patterns

---

## 10. Current Web Concerns

### 10.1 Proxy layer
- The proxy must support JSON and non-JSON cleanly.
- The proxy must not break multipart or upload flows.
- The proxy must preserve auth behavior.

### 10.2 Search
- Search must use the correct backend-backed search route.
- Search should not repurpose feed data.

### 10.3 Feed and dashboard
- Feed should not trigger unnecessary fetch storms.
- Feed and stories should be paginated and cached where possible.

### 10.4 Identity
- Local storage should not be the source of truth for identity.
- The backend should provide the canonical identity state.

---

## 11. Current Mobile Concerns

### 11.1 App shell
- Replace the demo counter with the actual Workora UI.

### 11.2 Authentication
- Token storage exists.
- Token attachment exists conceptually.
- The app needs a fully wired login/register/session flow.

### 11.3 Features still needed
- Feed
- Stories
- Reels
- Profile editing
- Messaging
- Search
- Uploads
- Trust card
- AI assistant

### 11.4 UX and product quality
- Build for one-handed use.
- Prioritize fast content consumption.
- Keep actions obvious and minimal.

---

## 12. Feature Build Plan

This section describes how each major feature should be made.

### 12.1 Auth
Implementation:
- Register phone/password and optional profile fields.
- Login returns JWT and user payload.
- Web stores token in httpOnly cookie.
- Mobile stores token securely.

Acceptance:
- User can sign up, log in, and immediately access protected routes.

### 12.2 Profile
Implementation:
- Profile page reads from backend.
- Edit forms update backend.
- Skills, languages, experience, education, certifications are managed separately.

Acceptance:
- Updates appear immediately and persist correctly.

### 12.3 Stories
Implementation:
- Story cards appear at the top of the home feed.
- Stories are short-lived.
- Stories can contain images or short video.

Acceptance:
- A user can post a story and others can view it quickly.

### 12.4 Reels
Implementation:
- Reels are vertical short video posts.
- Auto-play, pause-on-scroll, prefetch-next.
- Show trust badge and business context.

Acceptance:
- Reels feel smooth on mobile.

### 12.5 Posts
Implementation:
- Posts can be images, text, or mixed media.
- Posts should support project updates, testimonials, and offers.

Acceptance:
- Users can showcase business identity and recent work.

### 12.6 Search
Implementation:
- Search by trade, service, location, and trust.
- Use backend ranking and filters.

Acceptance:
- Search results are relevant and fast.

### 12.7 Messaging
Implementation:
- Start or resume a conversation.
- Send and read messages.
- Show unread indicators.

Acceptance:
- Two users can communicate reliably in real time or near-real time.

### 12.8 Trust card
Implementation:
- Public profile route that opens without app install.
- Shows verified trust signals and essential contact points.

Acceptance:
- The trust card loads fast and is shareable.

### 12.9 Uploads
Implementation:
- Upload avatars, reels, and post media.
- Validate size and mime types.
- Return public URLs.

Acceptance:
- Uploads survive real mobile network conditions.

### 12.10 AI
Implementation:
- AI asks clarifying questions.
- AI recommends the right pro or next step.
- AI summarizes profiles and job scope.

Acceptance:
- Users can move from intent to action faster than by manual browsing alone.

---

## 13. Phased Delivery Plan

This is the recommended order of work.

### Phase 0: Foundation and alignment
Goals:
- Confirm environment variables and deployment base URLs.
- Confirm backend is the source of truth.
- Confirm storage URLs and auth model.
- Confirm the final product flow.

Deliverables:
- API contract
- Auth contract
- Data model map
- Deployment checklist

Acceptance:
- Team can run the app locally and understand the architecture.

### Phase 1: Auth and profile reliability
Goals:
- Register/login/logout works everywhere.
- Profile create/edit works.
- Identity is server-trusted.

Deliverables:
- JWT middleware
- Auth screen flow
- Secure token storage
- Profile update flow

Acceptance:
- A new user can sign in and complete a profile.

### Phase 2: Instagram-style content layer
Goals:
- Add stories, reels, and posts.
- Make the feed feel like a creator platform.

Deliverables:
- Story model and UI
- Reel model and UI
- Post model and UI
- Feed ranking and pagination

Acceptance:
- A user can publish content and see it in the feed.

### Phase 3: Search and discovery
Goals:
- Help customers find the right business quickly.

Deliverables:
- Search by trade and location
- Trust ranking
- Debounced search
- Optimized query strategy

Acceptance:
- Search feels fast and useful.

### Phase 4: Messaging and conversion
Goals:
- Turn discovery into conversations.

Deliverables:
- Conversation list
- Thread view
- Send/read/unread logic
- Anti-duplication behavior

Acceptance:
- Two users can chat reliably.

### Phase 5: Trust lifecycle
Goals:
- Make trust real and auditable.

Deliverables:
- Gig lifecycle states
- Completed job logic
- Rating restrictions
- Badge logic

Acceptance:
- Trust score changes only when the workflow is valid.

### Phase 6: Uploads and media robustness
Goals:
- Make media posting stable on mobile networks.

Deliverables:
- Avatar uploads
- Reel uploads
- Thumbnail uploads
- Retry/progress UX

Acceptance:
- Uploads do not crash the app or server under normal usage.

### Phase 7: AI assistant
Goals:
- Reduce friction and shorten time-to-match.

Deliverables:
- Project scoping assistant
- Pro matching assistant
- Profile summary assistant
- Content helper

Acceptance:
- AI meaningfully helps users complete actions faster.

### Phase 8: Analytics, moderation, and growth
Goals:
- Measure and protect the platform.

Deliverables:
- Event logging
- Monitoring
- Admin tools
- Rate limiting

Acceptance:
- The platform can be monitored, debugged, and scaled.

### Phase 9: Launch hardening
Goals:
- Make the product reliable enough to pitch and grow.

Deliverables:
- Production migrations
- Security review
- Performance tuning
- Demo script
- Sample accounts

Acceptance:
- The product can be presented confidently and used by real users.

---

## 14. Performance Requirements

### 14.1 UI performance
- Fast initial load
- Smooth scroll on feed and reels
- Lazy loading of media
- Minimal blocking work on startup

### 14.2 API performance
- Keep endpoints focused
- Avoid unnecessary joins and subqueries
- Paginate lists
- Cache hot reads when possible

### 14.3 Database performance
- Index by real query patterns
- Use the right sort and filter indexes
- Use better search indexing for large datasets

### 14.4 Media performance
- Optimize file size and delivery
- Prefer public media URLs with a CDN-friendly setup
- Avoid huge memory spikes during upload handling

---

## 15. Security Requirements

### Must have
- JWT verification
- Ownership checks
- Input validation
- File type validation
- File size limits
- Rate limiting
- No hardcoded production secrets

### Must not have
- Blind trust in client-sent IDs
- Demo-only backdoors in production paths
- Unprotected write operations
- Hidden state that the UI cannot recover from

---

## 16. AI Builder Instructions

Any AI model that uses this file should follow these rules:

1. Read the whole file before making assumptions.
2. Preserve the product vision: Instagram for business, Angi trust, AI assistance.
3. Never replace real backend behavior with fake data.
4. Keep web, backend, and mobile consistent with each other.
5. Prefer building the smallest correct vertical slice over broad half-finished scaffolding.
6. When adding a feature, update the data model, API, UI, and acceptance criteria together.
7. If there is a performance or trust tradeoff, choose the option that preserves correctness first.
8. If a feature needs a new object or route, document it here.
9. If a feature touches auth, uploads, or trust, treat it as high priority.
10. Keep the codebase clean and production-oriented.

---

## 17. Definition of Ready

Workora is ready when all of the following are true:

- Users can register and log in securely
- Profiles are complete and editable
- Stories, reels, and posts work as a content system
- Feed and explore load quickly
- Search is relevant and fast
- Messaging works reliably
- Uploads are stable
- Trust scores and badges reflect real work
- AI helps users find and scope jobs faster
- The web app and mobile app both use the same backend truth
- The platform is monitored and can be debugged
- The platform is ready for a real pitch and pilot users

---

## 18. Practical Next Build Order

If you want the fastest path to a real live product, build in this order:

1. Auth and server-trusted identity
2. Profile completeness
3. Stories, reels, and posts
4. Feed and explore performance
5. Search and matching
6. Messaging
7. Trust score and gig completion lifecycle
8. Upload stability
9. AI assistant
10. Analytics and moderation
11. Launch hardening

---

## 19. Summary

Workora should become a trusted, visual, AI-assisted business marketplace.

The product should let people:
- Show their work
- Build trust
- Get found
- Get hired
- Keep conversations moving
- Complete jobs
- Prove credibility

The final experience should feel like:
- A social platform
- A services marketplace
- A trust network
- A mobile-first business engine

