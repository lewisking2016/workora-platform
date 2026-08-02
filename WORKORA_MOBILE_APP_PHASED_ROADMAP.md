# Workora Mobile App Phased Roadmap

This document defines how the Flutter mobile app should be built from the current scaffold into the real Workora product.

It is a build contract for AI models and engineers.
If this file conflicts with code, the code must be changed.

## 1. Mobile App Goal

The mobile app is the main Workora experience.

It must feel like:
- Instagram for business content
- WhatsApp for messaging
- A trusted local services marketplace
- A fast creator app for workers and businesses

The mobile app must support:
- discovery
- trust
- posting
- messaging
- profile management
- job conversion
- uploads
- AI assistance

## 2. Current Reality

The Flutter app currently has:
- secure token storage
- an API client
- auth repository methods
- auth models
- a simple app state container

The Flutter entrypoint is still the demo template and must be replaced.

## 3. Mobile App Principles

- Mobile first always
- Vertical content first
- Thumb-friendly navigation
- Low network friction
- Fast startup
- Clear auth state
- No fake data in production flows
- Real backend truth only

## 4. Mobile App Layers

### Layer 1: App shell and navigation
- Replace the demo counter app.
- Add real routes for feed, search, profile, messages, create, trust card, and AI.
- Add bottom navigation or a strong equivalent.
- Keep global state minimal and backend-driven.

### Layer 2: Authentication and session
- Login and register must work end to end.
- Save the token securely.
- Attach the token to all protected API calls.
- Show the correct user state after app restart.

### Layer 3: Feed and content browsing
- Show stories, reels, and posts.
- Support vertical scrolling and auto-play for reels.
- Allow liking, commenting, saving, sharing, and opening profiles.
- Prefetch the next item and keep scroll smooth.

### Layer 4: Profile and trust
- Show full profile details.
- Show trust score and badges.
- Show portfolio, skills, reviews, and service categories.
- Allow editing the owner’s profile.

### Layer 5: Search and discovery
- Search by trade, location, trust, availability, and keyword.
- Debounce user input.
- Show clean results with comparison and quick actions.

### Layer 6: Messaging and conversion
- List conversations.
- Open threads.
- Send and read messages.
- Show unread counts.
- Make chat feel immediate and reliable.

### Layer 7: Uploads and media
- Upload avatar, story media, reel media, and thumbnails.
- Show progress and retry states.
- Validate file size and type before upload.

### Layer 8: AI assistant
- Add a helper that can scope jobs, suggest pros, and summarize options.
- Use AI only with real data context.
- AI must help the user move faster, not replace the business logic.

### Layer 9: Notifications and engagement
- Show new messages, comments, likes, follows, mentions, and trust updates.
- Keep notification fetches efficient.

### Layer 10: Analytics and health
- Track core app actions.
- Surface error states clearly.
- Keep crash recovery and loading states graceful.

### Layer 11: Launch hardening
- Remove demo remnants.
- Improve empty states, error states, and offline-like behavior.
- Make sure the app remains usable on low bandwidth.

## 5. Mobile Feature Map

### Auth
- Register
- Login
- Logout
- Password reset if supported
- Token restore on startup

### Feed
- Story row
- Reel player
- Post cards
- Like/comment/save
- Open profile

### Profile
- Own profile
- Public profile
- Edit profile
- Skills and experience
- Ratings and trust score

### Search
- Keyword search
- Trade search
- Location-aware search
- Filter chips

### Messaging
- Conversation list
- Thread view
- Send message
- Read receipts

### Uploads
- Avatar upload
- Reel upload
- Story upload
- Thumbnail upload

### AI
- Project assistant
- Pro matcher
- Profile helper
- Content helper

## 6. Data and State Rules

- The backend is the source of truth.
- Local state may be used only for responsiveness.
- User identity must come from auth token and backend session data.
- Do not keep stale localStorage-style identity logic.
- Cache only what is safe to cache.

## 7. Phase 0: Foundation

Goals:
- Replace the demo app shell.
- Wire the actual navigation structure.
- Connect the existing API client and token store to app startup.

Deliverables:
- Real `main.dart`
- Routing setup
- Theme and layout system
- Auth bootstrap flow

Exit criteria:
- The app opens as Workora, not the Flutter demo counter.

## 8. Phase 1: Auth

Goals:
- Users can sign up, log in, and stay authenticated.

Deliverables:
- Register screen
- Login screen
- Secure token save and restore
- Logout flow
- Auth error handling

Exit criteria:
- A user can authenticate and reach the app without manual intervention.

## 9. Phase 2: Home Feed

Goals:
- Show the business social feed quickly.

Deliverables:
- Feed screen
- Story row
- Reel card
- Post card
- Like/comment actions
- Pull to refresh

Exit criteria:
- Feed content loads from the backend and feels smooth.

## 10. Phase 3: Profile and Trust

Goals:
- Make the profile feel credible and complete.

Deliverables:
- Public profile
- Editable owner profile
- Trust score
- Verified badge
- Skills, languages, experience, education, certifications

Exit criteria:
- The profile can be used as a trust card and portfolio.

## 11. Phase 4: Search and Discovery

Goals:
- Help hirers and customers find the right pro fast.

Deliverables:
- Search screen
- Search filters
- Ranking by trust and relevance
- Result comparison entry points

Exit criteria:
- Search returns useful results quickly.

## 12. Phase 5: Messaging

Goals:
- Turn discovery into real conversation.

Deliverables:
- Conversations list
- Thread screen
- Send message
- Read receipts
- Unread counts

Exit criteria:
- Two users can message reliably on different devices.

## 13. Phase 6: Uploads and Publishing

Goals:
- Let users create stories, reels, and portfolio posts.

Deliverables:
- Media picker
- Upload progress
- Retry on failure
- Post composer

Exit criteria:
- A user can publish content from the phone without crashing or hanging.

## 14. Phase 7: AI Assistant

Goals:
- Make Workora easier to use than manual browsing.

Deliverables:
- AI query box
- Suggested pros
- Job brief helper
- Content caption helper

Exit criteria:
- AI produces grounded recommendations from real platform data.

## 15. Phase 8: Analytics and Notifications

Goals:
- Track growth and keep users engaged.

Deliverables:
- Analytics events
- Notification list
- Badge counts

Exit criteria:
- Core engagement events are visible and measurable.

## 16. Phase 9: Launch Hardening

Goals:
- Make the app reliable enough for pilots and 500–1000+ users.

Deliverables:
- Performance cleanup
- Error handling cleanup
- Empty states
- Loading states
- Offline resilience patterns where possible

Exit criteria:
- The app is stable, polished, and pilot-ready.

## 17. Definition of Done for Mobile

The mobile app is ready when:
- auth works
- feed works
- stories work
- reels work
- posts work
- profile works
- search works
- messages work
- uploads work
- AI help works
- analytics work
- no demo template remains

