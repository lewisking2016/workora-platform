# Workora Web App Phased Roadmap

This document defines how the Next.js web app should be built and hardened for Workora.

It is the authoritative roadmap for the browser experience.

## 1. Web App Goal

The web app must support:
- discovery
- trust
- creator-style browsing
- profile viewing
- messaging
- search
- uploads
- admin and analytics workflows

The web experience should feel:
- polished
- fast
- responsive
- trustworthy
- content-rich

## 2. Current Reality

The web app already has:
- a successful build
- a proxy layer for backend access
- dashboard routes
- auth routes
- search route
- upload route

The current web app still needs more performance tuning, trust hardening, and feature completeness.

## 3. Web App Principles

- Use backend data as source of truth
- Keep proxy logic safe and simple
- Do not force JSON on non-JSON flows
- Prefer server rendering where useful
- Keep client fetches minimal and intentional
- Optimize for discoverability and conversion

## 4. Web Layers

### Layer 1: Public marketing layer
- Landing pages
- About pages
- Trust pages
- Business pages
- Help, safety, privacy, and terms
- Conversion entry points

### Layer 2: Auth and account layer
- Login
- Join
- Password reset
- Session handling
- Auth cookie management

### Layer 3: Dashboard and workspace layer
- Feed
- Explore
- Search
- Messages
- Create
- Saved
- Analytics
- Notifications
- Profile
- Pro tools

### Layer 4: Proxy and API access layer
- Forward requests to backend safely
- Preserve auth
- Support JSON and non-JSON bodies
- Return correct response types

### Layer 5: Content and trust layer
- Story and reel browsing
- Proof-of-work viewing
- Trust badge rendering
- Profile summary and review display

### Layer 6: Admin and growth layer
- Analytics
- Moderation
- Monitoring
- Content review
- Business insights

### Layer 7: Launch and performance layer
- Caching
- Revalidation
- Pagination
- Error handling
- Accessibility
- SEO

## 5. Web Feature Map

### Feed
- Vertical content layout
- Stories row
- Reels and posts
- Likes, comments, saves
- Open profile and message actions

### Explore
- Discovery by category and relevance
- Trending and trust-weighted items

### Search
- Search by trade, location, and trust
- Debounced typing
- Filter chips
- Compare results

### Messages
- Conversation list
- Thread view
- Send and read interactions

### Profile
- Public trust view
- Edit own profile
- Portfolio and reviews

### Create
- Upload media
- Compose post or reel
- Publish proof-of-work

### Analytics
- Track growth
- View usage
- View funnels

## 6. Data and Behavior Rules

- Never use feed data as a fake search source.
- Never hardcode user identity when backend identity exists.
- Never assume JSON for every endpoint.
- Preserve multipart and upload workflows.
- Keep browser state in sync with backend responses.

## 7. Phase 0: Foundation

Goals:
- Keep the build green.
- Lock the proxy contract.
- Confirm auth flow works from browser to backend.

Deliverables:
- Stable route map
- Stable proxy behavior
- Environment contract
- Auth cookie behavior

Exit criteria:
- The web app can start cleanly and reach backend routes reliably.

## 8. Phase 1: Public and Auth Pages

Goals:
- Make the entry experience clear and conversion-friendly.

Deliverables:
- Landing page polish
- Join and login forms
- Password recovery flow
- Trust-forward copy

Exit criteria:
- A visitor can join or log in without friction.

## 9. Phase 2: Dashboard Shell

Goals:
- Make the dashboard the control center for businesses and pros.

Deliverables:
- Left or top navigation
- Responsive dashboard layout
- Account summary
- Quick actions

Exit criteria:
- Users can move through the product without confusion.

## 10. Phase 3: Feed and Explore

Goals:
- Make the web feed feel like a creator marketplace.

Deliverables:
- Feed screen
- Explore screen
- Stories strip
- Media cards
- Trust indicators

Exit criteria:
- The feed is visually compelling and fast enough for browsing.

## 11. Phase 4: Search and Discovery

Goals:
- Help users find the right pro quickly.

Deliverables:
- Search page
- Filter controls
- Better ranking
- Search result card design

Exit criteria:
- Search feels relevant and reliable.

## 12. Phase 5: Messaging and Conversion

Goals:
- Let the browser be a real sales and conversation tool.

Deliverables:
- Conversations list
- Thread view
- Unread state
- Send message UI

Exit criteria:
- A user can move from profile to conversation without friction.

## 13. Phase 6: Profile and Trust

Goals:
- Make trust visible and understandable.

Deliverables:
- Trust card page
- Public profile page
- Reviews and badges
- Business/worker info blocks

Exit criteria:
- A profile can be shared and used as a trust landing page.

## 14. Phase 7: Create and Upload

Goals:
- Let users publish stories, reels, and posts from the web.

Deliverables:
- Upload interface
- Composer
- Progress and retry
- Publish confirmation

Exit criteria:
- Web publishing works without breaking uploads.

## 15. Phase 8: Analytics, Admin, and Pro Tools

Goals:
- Give the web app operational value, not just browsing.

Deliverables:
- Analytics dashboard
- Pro tools
- Saved items
- Notifications
- Moderation views if required

Exit criteria:
- Web supports business operations and platform management.

## 16. Phase 9: Performance and SEO

Goals:
- Make the web app fast and discoverable.

Deliverables:
- Caching
- Revalidation
- Pagination
- SEO metadata
- OpenGraph data
- structured data where useful

Exit criteria:
- Pages load quickly and are indexable where appropriate.

## 17. Phase 10: Launch Hardening

Goals:
- Prepare the web app for pilot users and public demo use.

Deliverables:
- Accessibility cleanup
- Error boundary cleanup
- Empty state cleanup
- Loading state cleanup
- Cross-device responsiveness

Exit criteria:
- The browser experience is polished enough for real users and investors.

## 18. Definition of Done for Web

The web app is ready when:
- auth works
- feed works
- search works
- messages work
- profiles work
- uploads work
- analytics work
- trust data is accurate
- proxy works for JSON and multipart
- the app is fast and responsive

