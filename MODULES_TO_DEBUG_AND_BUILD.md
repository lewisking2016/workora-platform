# Workora — Modules to Add/Debug (Start Now)

> Purpose: make Workora work **module-by-module** as a live platform (no demo mode) where proof-of-work content behaves like **Instagram/TikTok**, trust is like **Angi’s trust layer**, and messaging is like **Facebook/WhatsApp chat**.

---

## 0) Production “non-demo” rule (apply to every module)
Before wiring any UI flow, ensure:
- [ ] No placeholder feeds/users/media are served.
- [ ] Every screen data comes from backend routes (Fastify) using real DB rows.
- [ ] Every user action writes to backend and immediately reflects in UI.
- [ ] Auth is enforced server-side (JWT) and ownership is verified.

---

## 1) Auth Module (Login / Register / Logout)

### Must work
- [ ] Worker/Hirer can register and login with phone + password.
- [ ] JWT is stored securely on mobile.
- [ ] Subsequent requests authenticate automatically.

### What to add/debug
- Backend
  - [ ] Add JWT verification middleware to protected endpoints.
  - [ ] Remove any reliance on `userId` sent by client for sensitive operations (derive user from JWT).
  - [ ] Ensure `/auth/login` and `/auth/register` are stable with correct validation.
- Web proxy
  - [ ] Ensure proxy forwards headers correctly for JSON requests.
  - [ ] Ensure cookie `token` is set/used consistently.
- Mobile (Flutter)
  - [ ] Implement networking layer (base URL, timeouts, retries).
  - [ ] Save token + attach Authorization header on each request.

### Acceptance test
- [ ] Register → login → call `/profile/...` succeeds without manual userId.

---

## 2) Profile Module (Worker profile)

### Must work
- [ ] Worker creates and edits profile fields (bio, title, display name, trade, location).
- [ ] Worker manages skills, languages, experience, education, certifications.
- [ ] Profile shows trust score and proof signals.

### What to add/debug
- Backend
  - [ ] Verify profile endpoints match the UI needs (no missing fields, correct updates).
  - [ ] Add indexes for frequent profile lookups (trade, user_id joins).
- Web/mobile
  - [ ] UI forms validate before submit.
  - [ ] After update, refresh profile reliably.

### Acceptance test
- [ ] After editing skills/languages, profile shows updated lists immediately.

---

## 3) Proof-of-Work Feed Module (Instagram/TikTok-like)

### Must work
- [ ] Workers can post short video reels and thumbnails.
- [ ] Feed shows reels vertically with fast scrolling.
- [ ] Each reel is tied to a verified completed gig (shows “Verified Gig” badge).

### What to add/debug
- Backend
  - [ ] Ensure gigs create/search/feed endpoints provide correct fields.
  - [ ] Ensure a “verified completed gig” concept exists in DB logic.
    - Current schema has `gigs` but the “verified gig badge” must be derived from gig completion + rating (or explicit state).
  - [ ] Optimize `/gigs/feed` and `/gigs/explore` queries (indexes for ordering).
- Storage / uploads
  - [ ] Confirm upload endpoints produce public URLs that load reliably on mobile networks.
  - [ ] Replace `toBuffer()` if memory spikes occur under concurrent posting.
- Mobile/Web UI
  - [ ] Implement reel playback strategy (pause when not visible, prefetch next thumbnail).
  - [ ] Ensure feed pagination/infinite scroll works (avoid LIMIT-only bottlenecks).

### Acceptance test
- [ ] Post a reel → it appears in feed within seconds.
- [ ] Reel displays Verified badge only after the gig completion condition is met.

---

## 4) Search & Discovery Module (Angi-like discovery)

### Must work
- [ ] Hirer searches by trade/category.
- [ ] Results rank by trust score.

### What to add/debug
- Backend
  - [ ] Improve `/profile/search` performance.
    - Current uses `ILIKE` (may be slow at scale).
    - Add `pg_trgm` + trigram indexes OR use full-text search.
  - [ ] Ensure ranking uses correct trust score source.
- UI
  - [ ] Debounce search input.
  - [ ] Pagination and “load more”.

### Acceptance test
- [ ] Searching “plumber” returns relevant profiles quickly.

---

## 5) Trust Card Module (shareable link)

### Must work
- [ ] Trust card loads on mobile browsers without app install.
- [ ] Shows essential trust data: rating, badges, voice testimonial links (where available).

### What to add/debug
- Backend
  - [ ] Add/confirm endpoint for trust-card data (single fast response).
  - [ ] Ensure caching headers / CDN caching (if using web).
- Web
  - [ ] Implement route `/jua.kazi/@username` → dynamic page.
  - [ ] Ensure it fetches minimal data (one API call).

### Acceptance test
- [ ] Opening trust-card URL shows complete data in <2 seconds under normal conditions.

---

## 6) Gig Lifecycle Module (publish → hire → complete → rate)

### Must work
- [ ] Worker posts a gig/reel.
- [ ] Hirer can request/choose worker (even if escrow integration is Phase 2).
- [ ] Completion creates a “completed gig” record.
- [ ] Both sides rate each other.
- [ ] Trust score updates from ratings.

### What to add/debug
- Backend
  - [ ] Current code inserts gigs and ratings, but “completion” is not fully represented.
  - [ ] Add explicit gig_status (requested/accepted/in_progress/completed/cancelled) and completion timestamp.
  - [ ] Ensure ratings can only be submitted for completed gigs.
- UI
  - [ ] Create clear screens: Gig details, hire/request, completion confirmation.

### Acceptance test
- [ ] Completing a gig triggers trust score update and Verified badge state.

---

## 7) Messaging Module (Facebook/WhatsApp-like chat)

### Must work
- [ ] Conversations list loads.
- [ ] Send message.
- [ ] Mark read.
- [ ] Unread counts accurate.

### What to add/debug
- Backend
  - [ ] Add composite indexes matching message queries.
  - [ ] Ensure unread count query is efficient.
  - [ ] Make conversation creation deterministic + prevent duplicate conversations.
- UI
  - [ ] Real-time behavior (polling or websockets if implemented).
  - [ ] Thread pagination.

### Acceptance test
- [ ] Two devices can chat, unread count updates, read receipts update.

---

## 8) Upload & Media Pipeline Module (R2/S3)

### Must work
- [ ] Avatar upload works.
- [ ] Gig media upload works.
- [ ] URLs are accessible without authentication.

### What to add/debug
- Backend
  - [ ] Ensure multipart uploads are handled correctly.
  - [ ] Avoid reading full file into memory (`toBuffer()`), or limit concurrency.
- Web proxy
  - [ ] If uploads ever go through Next proxy, proxy must not break multipart.
  - [ ] Prefer calling backend upload directly from browser.
- UI
  - [ ] Upload progress indicator.
  - [ ] Retry failed uploads.

### Acceptance test
- [ ] Upload video/thumbnail, then immediately publish to feed using returned URL.

---

## 9) Dashboard / Admin / Moderation (to keep it safe + scalable)

### Must work
- [ ] Users can view their own activity.
- [ ] Admin can review reports and remove spam.

### What to add/debug
- Backend
  - [ ] Moderation endpoints (report, block, remove).
  - [ ] Rate limiting on posting/search/messaging.
- Web
  - [ ] Admin panels for trust-score events and gig completion disputes.

### Acceptance test
- [ ] Spam prevention works during tests.

---

## 10) Analytics & Activation Module (to reach 500–1000 actives)

### Must work
- [ ] Track activation funnel and retention.
- [ ] Track which trades convert.

### What to add/debug
- Add event logging on:
  - signup
  - profile_completed
  - gig_published
  - trust_card_viewed
  - message_sent
  - rating_submitted
- [ ] Build a minimal analytics dashboard (admin view).

### Acceptance test
- [ ] You can answer: “How many users published first reel in 24 hours?”

---

# Suggested Start Order (fastest path to live modules)
1) Auth module
2) Profile module
3) Upload + Proof-of-Work feed module (reels)
4) Search & Discovery
5) Messaging
6) Gig lifecycle + Verified badge logic
7) Trust card
8) Analytics + dashboard moderation

---

## What you must confirm for me to proceed with code-level debugging
- [ ] Which backend is the source of truth for “live” (current VPS DB)?
- [ ] Are there any WhatsApp Business APIs already integrated, or messaging is in-app for now?
- [ ] Do you want me to implement missing Flutter app pages (module UI) after this audit?

