# Workora — Readiness Plan for Pitch + Selling (500–1000 Active Users)

> Goal: make Workora **run reliably**, **feel fast**, and support the **core user journey** well enough to win attention/traction in competitions and onboarding ~500–1000 active users.

## 0) What “Ready for Pitch” Means (measurable)

### Product readiness
- [ ] Worker signup → profile creation completes successfully for new users
- [ ] Worker publishes proof-of-work gig/video → appears in feed
- [ ] Hirer can search/browse workers by trade and view trust signals
- [ ] Hirer can contact worker (WhatsApp flow or in-app fallback)
- [ ] Gig completion → both sides rate → trust score updates
- [ ] “Trust Card link” loads on mobile browsers (and on feature-phone browsers if possible)

### Reliability readiness
- [ ] Web + backend health endpoints working
- [ ] No major runtime errors during typical journeys
- [ ] Backend survives concurrent traffic bursts (at least during demo conditions)

### Performance readiness (“fast”)
- [ ] Feed and profile pages load within acceptable demo latency
- [ ] Messaging + search are not visibly slow
- [ ] Uploads do not crash under normal concurrency

### Growth readiness
- [ ] Onboarding funnel supports rapid activation (target: < 2 minutes to first publish)
- [ ] Basic analytics and cohort tracking exist (activation, retention, trust-score events)

### Competition readiness
- [ ] Demo script works end-to-end, consistently
- [ ] Short video + screenshots show the trust graph + trust card
- [ ] Clear pilot plan: how you onboard 200 workers in a city and reach 500–1000 actives

---

## 1) Project Audit & Alignment Phase (Foundation)

### Goals
- Align system behavior with the **investment memorandum** user journey:
  - Feed (proof-of-work) → Chat → Profile → Trust Card
- Ensure your existing deployed backend matches what the app assumes.

### Deliverables
- [ ] Document API contract: routes, expected payloads, and auth mechanism
- [ ] Confirm deployed backend base URL + environment variables for web + mobile
- [ ] Confirm storage/public URL behavior for avatars/gig media
- [ ] Create a “single source of truth” for trust card URL format: `jua.kazi/@username`

### Acceptance criteria
- A developer can run a local/dev environment and reproduce the same flow as staging.

---

## 2) Core Loop Reliability Phase (MVP to “demo-grade”)

### Goals (core loop)
1. Worker signup + profile creation (30 seconds target)
2. Worker publishes gig/video proof-of-work
3. Hirer searches and views worker trust signals
4. Hirer contacts worker
5. After completion, ratings update trust score
6. Trust card link displays correct trust data

### Deliverables
- [ ] Make signup/profile creation robust (validation + error messaging)
- [ ] Ensure gig creation writes correct records and media URLs
- [ ] Ensure feed query returns items quickly and consistently
- [ ] Ensure ratings trigger trust-score update deterministically
- [ ] Ensure trust card page is built for speed + caching

### Performance targets
- Feed page: stable response time under demo load
- Profile page: avoids N+1 API calls
- Search: returns results quickly or uses an optimized index/search strategy

---

## 3) Trust Graph Integrity Phase (Trust must be credible)

### Goals
- Prevent spoofing of trust signals
- Ensure trust is derived from verified gig outcomes

### Deliverables
- [ ] Enforce backend auth/ownership checks (JWT derived user identity)
- [ ] Ensure gig → rating → trust-score linkage is correct
- [ ] Add validation rules for rating bounds and gig ownership
- [ ] Add idempotency/anti-duplication for likes, ratings, and conversations

### Acceptance criteria
- Trust score changes only when the underlying gig completion/rating is valid.

---

## 4) Performance & Scale Phase (Fast enough for 500–1000 active users)

### Goals
- Remove obvious bottlenecks that will appear as data grows

### Priority optimization checklist (backend + DB)
- [ ] Add/verify DB indexes to match sorting/filtering in:
  - feed/explore (`ORDER BY created_at`, `ORDER BY view_count`)
  - messaging read/unread queries
  - search queries (use pg_trgm or full-text search)
- [ ] Reduce correlated subqueries / multiple round trips per feed item
- [ ] Add pagination to avoid LIMIT-only bottlenecks
- [ ] Add caching where appropriate:
  - trust-card response caching
  - feed caching for short TTL windows

### Acceptance criteria
- Demo flows remain responsive during concurrent testing.

---

## 5) Uploads & Media Pipeline Phase (No crashes, no slowdowns)

### Goals
- Uploads should be reliable and not memory-leaky during demos

### Deliverables
- [ ] Replace `toBuffer()` approach with streaming upload (or enforce strict concurrency)
- [ ] Validate mime types and size before buffer reads
- [ ] Ensure uploads work through the web proxy (multipart safe) or bypass proxy for uploads
- [ ] Confirm CDN/public URL access works from mobile networks

---

## 6) Messaging Phase (Chat must be credible)

### Goals
- WhatsApp Business integration (as described) or in-app fallback

### Deliverables
- [ ] Conversation creation works deterministically between participants
- [ ] Messages are stored, read receipts update correctly
- [ ] Unread counts are efficient via proper indexes

### Acceptance criteria
- Chat works in a realistic demo scenario without delays.

---

## 7) Growth, Analytics & Monitoring Phase (So you can prove traction)

### Goals
- Track activation + usage and prove value

### Deliverables
- [ ] Add analytics events:
  - signup, profile_completed, gig_published, trust_card_viewed, rating_submitted, message_sent
- [ ] Add admin monitoring dashboard (basic):
  - error rate, latency percentiles, upload errors
- [ ] Add user funnel instrumentation + cohort view

---

## 8) Competition Demo Readiness Phase (Win with a flawless story)

### Goals
- Make the demo repeatable and compelling

### Deliverables
- [ ] Write a 7–10 minute demo script mapping directly to the memorandum:
  - Feed proof-of-work
  - Trust signals
  - Profile credibility
  - Trust card shareability
- [ ] Prepare sample accounts (1 worker, 1 hirer, admin/pro)
- [ ] Prepare fallback plan if WhatsApp integration fails (in-app chat fallback)
- [ ] Produce one-page pitch deck + technical appendix

### Acceptance criteria
- Any judge can watch the demo and understand the trust graph value in one pass.

---

## 9) Team Skills to Install (to keep development moving)

### Engineering skills
- Flutter architecture + networking (auth storage, retries, media playback)
- Next.js performance (caching, SSR/ISR, edge/proxy correctness)
- Fastify API design + auth middleware + validation patterns
- Postgres indexing + query optimization
- S3/R2 streaming uploads

### Product skills
- Funnel design + onboarding UX
- Trust & safety (anti-spoofing, moderation)
- Demo storytelling + competitive positioning

### Ops / DevOps skills
- Environments + secrets management
- CI/CD pipeline (lint/build/test deploy)
- Observability (logs, metrics, alerts)

---

## 10) Suggested Milestones Toward 500–1000 Active Users

## 10.1) “Fully live” requirement (NO demo mode)

To satisfy “make the app functional in all modules and be fully live (no demo data)”, the key change is: **remove any hardcoded demo UI/data and replace with real backend-driven state**.

### What “NO demo” means operationally
- Every screen pulls real data from backend routes.
- Every action (signup, publish gig, like/comment, message, rate, update profile) writes to backend and updates UI from backend responses.
- No placeholder user IDs, no fake feeds, no mocked trust cards.

### Current blocker found in this repo
- The Flutter app entrypoint `workora-app/lib/main.dart` is still the default Flutter “Flutter Demo” counter template.
- Therefore, the mobile app is **not yet implementing the Workora modules** (Feed/Chat/Profile/Trust Card).

### Immediate module-by-module implementation scope
- [ ] Auth module: register/login → store JWT → attach to requests
- [ ] Profile module: fetch/update worker profile + skills/languages/etc.
- [ ] Feed module: publish gig proof-of-work → fetch feed
- [ ] Trust Card module: web/shareable endpoint (or in-app WebView) backed by API
- [ ] Messaging module: conversations list + send/mark read
- [ ] Ratings module: submit rating after gig completion and refresh trust score
- [ ] Upload module: avatar + gig media upload (R2/S3)

### Backend/web readiness to support the live modules
- [ ] Ensure all backend endpoints required by the modules are available and protected correctly
- [ ] Ensure web proxy forwards request bodies correctly for every API call used
- [ ] Ensure the DB indexes cover the module query patterns


### Milestone A (Week 1–2): Demo-grade core loop
- Signup/profile complete
- Gig publish appears in feed
- Trust card loads

### Milestone B (Week 3–4): Trust integrity + speed
- Auth/ownership hardening
- Index tuning for feed/search
- Optimized trust-card responses

### Milestone C (Week 5–6): Messaging + uploads reliability
- Conversation + messages stable
- Upload pipeline robust on real networks

### Milestone D (Ongoing): Analytics + iteration
- Measure activation/retention
- Improve onboarding to reach 500 actives

---

## 11) Final “Ready for Pitch” Checklist (printable)
- [ ] Core loop end-to-end works
- [ ] Trust score updates deterministically
- [ ] Trust card shows the right data
- [ ] Feed loads quickly
- [ ] Search returns relevant results quickly
- [ ] Messaging works (WhatsApp or fallback)
- [ ] Uploads stable
- [ ] Backend monitored + errors visible
- [ ] Demo script rehearsed and reproducible
- [ ] Analytics and pilot plan ready

---

## Notes on the current system (based on repository analysis)
- Backend is already deployed, so this roadmap focuses on **development readiness** rather than infrastructure bring-up.
- Known high-impact “fast + credible” work areas for future scaling:
  - DB index coverage for feed/search/messaging
  - proxy correctness for non-JSON/multipart
  - upload pipeline robustness
  - trust/auth integrity enforcement

