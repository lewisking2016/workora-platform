# Workora Security Audit & Remediation

**Audited:** 2026-08-12
**Scope:** workora-backend, workora-web, infra (docker-compose, deploy), production DB

---

## 🔴 CRITICAL — ACTION REQUIRED BY OWNER

### 1. Live brute-force attack on the production login API
The public backend (`http://4.221.170.153:3001`) is under an **active brute-force attack** on the
seeded demo accounts (`0711222333`, `0722333444`, …). Evidence: `auth_login_attempts` reached
`failed_count = 1001` twice within minutes, re-locking the accounts between cleanups. Rate of
~300+ attempts/minute.

**Why it works:** the deployed backend has no rate limiting and CORS `origin: '*'`.

**Fix applied (in repo, needs deploy):**
- `@fastify/rate-limit` on `/auth/login` + `/auth/register` (30/min/IP) and `/auth/forgot` (10/min/IP).
- Fixed the lockout counter bug that let a stale streak re-lock an account forever.

**What the owner must do:**
1. **Deploy** (push to `main` → GitHub Action → VPS) so rate limiting goes live.
2. **Change the demo passwords** (they are in `seed_credentials.md`, which may be public).
3. If the attack persists after deploy, rotate/block the IPs at the VPS firewall.

### 2. Production credentials committed to git
`docker-compose.yml` contains live values for `DATABASE_URL`, `JWT_SECRET`, and full R2 keys.
Anyone with repo access can connect to the database and object storage.

**Fix applied (in repo):** `.env.example` documents the required variables.
**What the owner must do:**
1. **Rotate** the R2 keys and the DB password (assume compromise — they have been in git history).
2. Move values to an uncommitted `.env` on the VPS and reference them from `docker-compose.yml`
   (e.g. `DATABASE_URL: ${DATABASE_URL}`), or use GitHub secrets + the deploy workflow.
3. Consider making the repo private.

---

## 🟠 High — fixed in this pass (needs deploy)

| Finding | Fix |
| --- | --- |
| Auto-migration silently failed on every startup (whole schema ran as one transaction; a bad index rolled everything back). DB was stuck on the legacy `schema_v2` shape for months. | Migration now runs statement-by-statement; one failure is logged and skipped. |
| Missing tables in prod: `collections`, `collection_items`, `collection_saves`, `post_drafts`, `saved_profiles`, `saved_searches`, `profile_reports`, `conversation_states`, `message_attachments`, `notification_reads`, `notification_preferences`, `system_settings`. **This broke collections, drafts, saved items, pin/archive/mute, and notification settings in production.** | **Migration already applied to the production DB** — 62/62 statements green, all tables + columns verified. Features work now. |
| `conversations` used legacy `participant_a/b` columns; all messaging queries referenced `participant_1/2` → **messaging was broken in production**. | Columns added + backfilled. **Verified end-to-end**: create conversation → send → read → unread badge → follow notification all work. |
| `analytics_events` table missing `session_id`, `page_path`, `screen_name`, etc. → analytics events insert failed. | Legacy columns added via migration. |
| `PATCH /auth/team` and `/auth/subscription` trusted a client-supplied `userId` from the body → account-takeover-by-ID risk. | Both now require JWT and use `request.user.id`; values validated. |
| Hardcoded JWT fallback secret in code. | Production refuses to start without `JWT_SECRET`; dev fallback only outside production. |
| CORS `origin: '*'` on the whole API. | Configurable via `CORS_ORIGINS` (defaults to localhost + prod domain). |
| **Critical JWT dependency** (`fast-jwt` via `@fastify/jwt` — auth bypass / algorithm confusion CVEs). | Upgraded **Fastify 4 → 5** and `@fastify/jwt` 8 → 10. `npm audit`: **0 vulnerabilities** (was 1 critical, 3 high, 1 moderate). Full JWT sign/verify and route smoke tests pass. |
| Uploads accepted any file type into R2. | MIME + extension whitelist (images/video/PDF), 415 otherwise. |
| Notifications never included follows (Follow button in UI was dead). | Backend now emits `follow` notifications; web Follow button wired. |

## 🟡 Medium — applied to web (needs deploy)

- Messaging page now polls (4s thread / 15s list), pauses on hidden tab — feels real-time without WebSockets.
- Search is debounced (300ms) — was firing an API call + saved-search write on every keystroke.
- `ReelsStrip` no longer falls back to hardcoded mock reels (violated the "no demo data" rule).
- SEO: `sitemap.xml` + `robots.txt` added; pages disallow `/dashboard`, `/api`, `/auth`.
- `@workora/shared-types` package was broken (no `index.ts`) — now contains the shared API contract.

## 🟢 Recommendations for later

- **Streaming uploads**: replace `data.toBuffer()` (50MB in memory) with `@aws-sdk/lib-storage` streaming + file-size guard before read.
- **Feed query**: remove per-row correlated `(SELECT COUNT(*) FROM gig_likes …)` subqueries (denormalized counters or `LEFT JOIN … GROUP BY`).
- **Notifications**: replace the compute-on-read model with a real `notifications` table when traffic grows.
- **Move schema auto-migration** to real versioned migrations (e.g. node-pg-migrate).
- **WebSocket** for messaging once concurrent users grow past polling scale.
- **Rate limit remaining public routes** (search, messages) behind per-route limits as load grows.
- **Remove hardcoded VPS IP** from `next.config.ts` rewrites / `backend-url.ts` / Flutter `constants.dart` — use env vars everywhere.

## Verification performed
- Backend: `node --test` (6 tests pass), syntax checks, isolated JWT sign/verify on Fastify 5, live server smoke test (health/trades/search/settings), full auth→messaging→notifications E2E against the production DB.
- DB migration: 62 statements applied, 0 skipped, all 35 tables + column shapes verified.
- Web: `tsc --noEmit` (see `workora-web` verification after changes).

## Deploy checklist
1. `git add` + commit.
2. Push to `main` (GitHub Action deploys to the VPS via SSH + docker-compose).
3. On the VPS: create `.env` with the values from `.env.example` (rotate credentials first!).
4. Verify `https://workora.imeantech.com` login + messaging after deploy.
