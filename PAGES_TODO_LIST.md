# Workora Pages - What Needs Work

This document lists what needs to be improved on each page after data seeding.

## ✅ COMPLETED PAGES

### 1. Login Page (`/login`)
**Status**: ✅ Production Ready
- Responsive Workora loader
- Form validation
- Error handling
- Instagram-style UI

### 2. Join/Register Page (`/join`)
**Status**: ✅ Production Ready
- Multi-step registration
- Trade selection
- Phone validation
- Birthday picker
- Responsive loader

### 3. Profile Page (`/dashboard/profile`)
**Status**: ✅ Production Ready
- Instagram-style circular avatar with gradient ring
- Initial-based fallback avatars
- Live data from backend
- Portfolio grid
- Trust status cards
- Performance stats

### 4. Analytics Page (`/dashboard/analytics`)
**Status**: ✅ Production Ready
- Time range selector
- Metric cards with growth indicators
- Performance charts
- Business insights
- Live data integration

---

## 🔧 NEEDS WORK

### 5. Feed Page (`/dashboard/feed`)
**Location**: `workora-web/src/app/dashboard/feed/page.tsx`

**Current Issues**:
- [ ] No pagination (loads all gigs at once)
- [ ] No infinite scroll
- [ ] Missing story carousel at top
- [ ] No video auto-play logic
- [ ] Missing engagement animations (like/comment)

**What to Add**:
```typescript
// Add infinite scroll
- Implement cursor-based pagination
- Load 20 posts initially, then 10 more on scroll
- Add loading skeleton during fetch

// Add story carousel
- Show circular avatars at top
- Stories expire after 24h
- Add/view story functionality

// Add video player
- Auto-play when in viewport
- Pause when scrolled away
- Mute/unmute controls
- Full-screen option

// Add engagement
- Animated like heart (double-tap or button)
- Comment modal
- Share functionality
- Save to bookmarks
```

**Priority**: 🔴 HIGH

---

### 6. Explore Page (`/dashboard/explore`)
**Location**: `workora-web/src/app/dashboard/explore/page.tsx`

**Current Issues**:
- [ ] No category filtering
- [ ] No location filtering
- [ ] Missing "Near Me" feature
- [ ] No sorting options (trending, recent, top-rated)
- [ ] Grid layout needs improvement

**What to Add**:
```typescript
// Add filters
- Category dropdown (Plumber, Electrician, etc.)
- Location dropdown (Nairobi, Mombasa, etc.)
- Rating filter (4+ stars, 5 stars only)
- Sort by: Trending, Recent, Top Rated, Nearest

// Add grid improvements
- Masonry layout for varied content
- Hover effects showing stats
- Quick view modal
- "Near Me" with geolocation
```

**Priority**: 🔴 HIGH

---

### 7. Search Page (`/dashboard/search`)
**Location**: `workora-web/src/app/dashboard/search/page.tsx`

**Current Issues**:
- [ ] Search results not optimized
- [ ] No search history
- [ ] No suggested searches
- [ ] Missing filters sidebar
- [ ] No "People" vs "Posts" tabs

**What to Add**:
```typescript
// Add search enhancements
- Debounced search input (300ms delay)
- Search history (last 10 searches)
- Suggested/trending searches
- Tabs: "All", "People", "Posts", "Services"

// Add filters sidebar
- Location radius slider
- Price range
- Availability
- Ratings
- Verification status

// Add search results
- Highlight matching terms
- Show profile snippets
- Quick contact button
- Save search feature
```

**Priority**: 🟡 MEDIUM

---

### 8. Messages Page (`/dashboard/messages`)
**Location**: `workora-web/src/app/dashboard/messages/page.tsx`

**Current Issues**:
- [ ] No real-time updates
- [ ] Missing typing indicators
- [ ] No read receipts
- [ ] File/image upload missing
- [ ] No message search
- [ ] Missing conversation settings

**What to Add**:
```typescript
// Add real-time features
- WebSocket or polling for new messages
- Typing indicator ("John is typing...")
- Read receipts (✓✓ blue checkmarks)
- Online status indicators

// Add rich messaging
- Image/video upload
- Voice messages
- File attachments
- Emoji picker
- Message reactions

// Add conversation management
- Search within conversation
- Mute notifications
- Delete conversation
- Block/report user
- Message timestamps
```

**Priority**: 🔴 HIGH

---

### 9. Works/Portfolio Page (`/dashboard/works`)
**Location**: `workora-web/src/app/dashboard/works/page.tsx`

**Current Issues**:
- [ ] No upload functionality
- [ ] Missing portfolio categories
- [ ] No before/after slider
- [ ] Missing video preview
- [ ] No edit/delete options

**What to Add**:
```typescript
// Add upload modal
- Video upload with thumbnail generation
- Before/after photo pairs
- Title and description
- Category selection
- Location tagging

// Add portfolio management
- Grid/list view toggle
- Sort by date, views, likes
- Edit work details
- Delete confirmation
- Set featured work

// Add analytics per work
- View count
- Engagement rate
- Traffic sources
```

**Priority**: 🟡 MEDIUM

---

### 10. Create/Upload Page (`/dashboard/create`)
**Location**: `workora-web/src/app/dashboard/create/page.tsx`

**Current Issues**:
- [ ] Upload flow not complete
- [ ] No video preview before upload
- [ ] Missing thumbnail selection
- [ ] No draft saving
- [ ] Missing location tagging

**What to Add**:
```typescript
// Add upload wizard
- Step 1: Upload video (drag & drop)
- Step 2: Select thumbnail (auto-generated + manual)
- Step 3: Add title & description
- Step 4: Select category & tags
- Step 5: Add location

// Add media processing
- Video compression preview
- Thumbnail generator (3 options)
- Progress bar during upload
- Error handling & retry

// Add post scheduling
- Publish now / Schedule later
- Save as draft
- Preview before publish
```

**Priority**: 🔴 HIGH

---

### 11. Notifications Page (`/dashboard/notifications`)
**Location**: `workora-web/src/app/dashboard/notifications/page.tsx`

**Current Issues**:
- [ ] No real notifications system
- [ ] Missing grouping by type
- [ ] No mark as read
- [ ] Missing notification settings

**What to Add**:
```typescript
// Add notification types
- New likes on your posts
- New comments
- New followers
- Profile views
- Message requests
- Job inquiries
- Rating received

// Add management
- Mark all as read
- Filter by type (All, Likes, Comments, Messages)
- Delete notifications
- Notification settings (enable/disable by type)
- Push notification preferences
```

**Priority**: 🟡 MEDIUM

---

### 12. Saved/Bookmarks Page (`/dashboard/saved`)
**Location**: `workora-web/src/app/dashboard/saved/page.tsx`

**Current Issues**:
- [ ] Not implemented yet
- [ ] No collections/folders
- [ ] Missing save functionality across app

**What to Add**:
```typescript
// Add saved items
- Saved posts grid
- Saved profiles
- Collections/folders ("Kitchen Ideas", "Plumbers to Contact")
- Add notes to saved items

// Add management
- Remove from saved
- Move between collections
- Share collection
- Sort by date saved
```

**Priority**: 🟢 LOW

---

### 13. Pro/Subscription Page (`/dashboard/pro`)
**Location**: `workora-web/src/app/dashboard/pro/page.tsx`

**Current Issues**:
- [ ] No payment integration
- [ ] Missing plan comparison
- [ ] No subscription management

**What to Add**:
```typescript
// Add plan comparison
- Free vs Pro Plus features table
- Pricing: Ksh 300/month
- Benefits list with icons
- Success stories/testimonials

// Add payment
- M-Pesa integration
- Card payment (Stripe/Paystack)
- Invoice generation
- Receipt/confirmation

// Add subscription management
- Current plan status
- Upgrade/downgrade
- Cancel subscription
- Billing history
- Auto-renewal settings
```

**Priority**: 🟢 LOW (Business feature)

---

### 14. Landing Page (`/`)
**Location**: `workora-web/src/app/page.tsx`

**Current Issues**:
- [ ] Missing hero video/animation
- [ ] No testimonials section
- [ ] Missing app screenshots
- [ ] No social proof (numbers)
- [ ] Missing FAQ section

**What to Add**:
```typescript
// Hero section
- Animated headline
- Video background or hero image
- Clear CTA buttons (Join as Pro / Find a Pro)
- Search bar preview

// Social proof
- "50,000+ professionals registered"
- "100,000+ jobs completed"
- "4.8/5 average rating"
- Logo strip (featured in...)

// How it works
- 3-step process with animations
- Screenshots/mockups
- Category showcase

// Testimonials
- Real user reviews
- Before/after examples
- Video testimonials

// FAQ accordion
- Common questions
- Pricing info
- How to get started
```

**Priority**: 🟡 MEDIUM

---

### 15. Public Profile Page (`/profile`)
**Location**: `workora-web/src/app/profile/page.tsx`

**Current Issues**:
- [ ] No shareable link format
- [ ] Missing contact CTA
- [ ] No portfolio showcase
- [ ] Missing trust badges

**What to Add**:
```typescript
// Add public view
- Clean URL: /profile/username or /p/username
- Instagram-style layout
- Contact button (opens WhatsApp/messages)
- Share button

// Add trust section
- Verification badges
- Ratings summary
- Completed jobs count
- Member since date
- Response time

// Add portfolio
- Best work showcase
- Before/after gallery
- Video player
- Category filter
```

**Priority**: 🟡 MEDIUM

---

## 🎯 PRIORITY RANKING

### Must Fix Before Launch (P0)
1. **Feed Page** - Core user experience
2. **Messages Page** - Core communication
3. **Create Page** - Core content creation
4. **Explore Page** - Core discovery

### Should Fix Soon (P1)
5. **Search Page** - Important for findability
6. **Works Page** - Portfolio management
7. **Landing Page** - First impression
8. **Public Profile** - Sharing/marketing

### Nice to Have (P2)
9. **Notifications** - Engagement
10. **Saved Page** - User convenience
11. **Pro Page** - Monetization

---

## 🔄 CROSS-PAGE IMPROVEMENTS NEEDED

### 1. Real-time Features
- [ ] WebSocket connection for messages
- [ ] Live notification badge updates
- [ ] Online/offline status
- [ ] Typing indicators

### 2. Image/Video Handling
- [ ] Lazy loading all images
- [ ] Video player component (reusable)
- [ ] Thumbnail generation
- [ ] Image optimization

### 3. Navigation
- [ ] Bottom nav on mobile (Instagram-style)
- [ ] Sidebar active states
- [ ] Breadcrumbs where needed
- [ ] Back button behavior

### 4. Performance
- [ ] Implement pagination everywhere
- [ ] Add loading skeletons
- [ ] Optimize images (Next.js Image)
- [ ] Code splitting for heavy pages

### 5. Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] Focus management
- [ ] Color contrast fixes

### 6. SEO
- [ ] Meta tags for all pages
- [ ] Open Graph images
- [ ] Sitemap generation
- [ ] Structured data (Schema.org)

---

## 📱 MOBILE-SPECIFIC IMPROVEMENTS

- [ ] Bottom navigation bar (Feed, Explore, Create, Messages, Profile)
- [ ] Swipe gestures (swipe post for more options)
- [ ] Pull-to-refresh on feed
- [ ] Native share sheet
- [ ] Camera integration for uploads
- [ ] Location services integration

---

## 🎨 UI/UX CONSISTENCY

- [ ] Standardize button styles
- [ ] Consistent spacing (use Tailwind spacing scale)
- [ ] Standard card component
- [ ] Standard modal component
- [ ] Loading state patterns
- [ ] Empty state designs
- [ ] Error state designs

---

## 🔐 SECURITY & AUTH

- [ ] Protected route middleware
- [ ] Session expiry handling
- [ ] CSRF protection
- [ ] Rate limiting on sensitive actions
- [ ] Input sanitization
- [ ] XSS prevention

---

## 📊 ANALYTICS & TRACKING

- [ ] Page view tracking
- [ ] Event tracking (clicks, likes, shares)
- [ ] User flow analysis
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] A/B testing framework

---

## 🚀 DEPLOYMENT READINESS

- [ ] Environment variables documented
- [ ] Database migrations automated
- [ ] CI/CD pipeline configured
- [ ] Monitoring dashboards
- [ ] Backup strategy
- [ ] Rollback plan
- [ ] Load testing completed
- [ ] Security audit done

---

## Next Steps

1. **Run data seeding script** (see DATA_SEEDING_GUIDE.md)
2. **Fix Feed page first** (highest priority)
3. **Add real-time messaging**
4. **Complete upload functionality**
5. **Polish explore and search**

Each page improvement should include:
- Backend API changes (if needed)
- Frontend component updates
- Testing
- Documentation
