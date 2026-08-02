# Workora Data Seeding Guide

This guide explains how to populate your Workora database with realistic sample data for demonstrations and testing.

## What This Does

The seed script creates:
- **50 users** with realistic Kenyan names (John Kamau, Mary Wanjiku, etc.)
- **40 worker profiles** with real Kenyan trades (Plumber, Electrician, Mechanic, etc.)
- **300+ gigs/posts** with real images from Unsplash
- **Realistic engagement**: likes, comments, ratings
- **Skills, languages, and experience** for each worker
- **Real Kenyan locations**: Nairobi, Westlands, Kilimani, Mombasa, Kisumu, etc.

## Prerequisites

1. PostgreSQL database running
2. Database connection details in `.env` file

## Step 1: Update Database Connection

Edit `workora-backend/.env` to match your database:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=workora
DB_USER=postgres
DB_PASSWORD=your_password
```

Or if using the VPS database, update these values to match your VPS PostgreSQL settings.

## Step 2: Run the Seed Script

### On VPS (Remote):

```bash
# SSH into VPS
ssh azureuser@4.221.170.153

# Navigate to backend
cd /home/lewis/workora-platform/workora-backend

# Run the seed script
node seed_realistic_data.js
```

### On Local Machine:

```bash
# Navigate to backend folder
cd workora-backend

# Run the seed script
node seed_realistic_data.js
```

## Step 3: Verify Data

After seeding, you should see:
- Users in login dropdown
- Profile cards on explore page
- Gigs/posts in the feed
- Real Kenyan names and locations everywhere

## Test Login Credentials

**All users have the same password for testing:**
- **Password**: `password123`
- **Username**: any username from the database (e.g., `johnkamau10`, `marywanjiku25`)

**Sample test accounts created:**
- `johnkamau10` / `password123`
- `marywanjiku25` / `password123`
- `peterkariuki42` / `password123`

## What Gets Seeded

### Users & Profiles
- **Real Kenyan names**: John Kamau, Mary Wanjiku, Peter Otieno, Jane Akinyi
- **Real trades**: Plumber, Electrician, Carpenter, Mason, Mechanic, Tailor, Barber
- **Real locations**: Nairobi CBD, Westlands, Kilimani, Mombasa, Kisumu
- **Trust scores**: 3.5 - 5.0 stars
- **Verification**: 70% verified professionals

### Gigs/Posts
- **Real images** from Unsplash matching each trade
- **Professional titles**: "Plumbing work in Westlands", "Quality electrical service"
- **View counts**: 10-500 views per post
- **Likes**: 5-30 likes per post
- **Comments**: 2-8 comments per post

### Engagement
- **Realistic comments**: "Great work! Highly recommended", "Very professional service"
- **Ratings**: 4-5 stars with detailed reviews
- **Profile completeness**: Skills, languages, experience for each worker

## Customization

### Change Number of Users

Edit `seed_realistic_data.js` line 262:
```javascript
const users = await createUsers(50); // Change 50 to your desired number
```

### Change Trades

Edit the `TRADES` array (line 14) to add/remove professions:
```javascript
const TRADES = [
  'Plumber', 'Electrician', 'Your Trade Here'
];
```

### Change Locations

Edit the `LOCATIONS` array (line 8):
```javascript
const LOCATIONS = [
  'Nairobi CBD', 'Your Location Here'
];
```

## Troubleshooting

### Database Connection Error

```bash
Error: Connection refused
```
**Solution**: Check if PostgreSQL is running and `.env` credentials are correct.

### Permission Denied

```bash
Error: permission denied
```
**Solution**: On VPS, use `sudo node seed_realistic_data.js`

### Duplicate Key Error

```bash
Error: duplicate key value violates unique constraint
```
**Solution**: Script will clear existing data first. If this fails, manually clear:
```sql
DELETE FROM users;
```

## Re-seeding Data

To re-seed with fresh data:

```bash
node seed_realistic_data.js
```

The script automatically clears old data before inserting new data.

## Production Warning

⚠️ **DO NOT run this script on production database!**

This script **deletes all existing data** before seeding. Only use on:
- Development databases
- Staging databases
- Demo/presentation databases

## Next Steps After Seeding

1. **Test login**: Use any seeded username with `password123`
2. **Browse profiles**: Go to `/explore` to see worker profiles
3. **View feed**: Go to `/dashboard/feed` to see posts
4. **Test search**: Search for trades like "Plumber" or "Electrician"
5. **Check analytics**: View `/dashboard/analytics` for stats

## Sample User Profiles Created

After seeding, you'll have profiles like:

| Name | Username | Trade | Location | Trust Score |
|------|----------|-------|----------|-------------|
| John Kamau | johnkamau10 | Plumber | Westlands | 4.8 |
| Mary Wanjiku | marywanjiku25 | Tailor | Kilimani | 4.5 |
| Peter Otieno | peterotieno42 | Mechanic | Mombasa | 4.7 |
| Jane Akinyi | janeakinyi18 | Barber | Nairobi CBD | 4.9 |

All images are real, all data is realistic, and all users are fully functional for testing!

## Support

For issues, check:
1. Database connection in `.env`
2. PostgreSQL is running
3. Node.js dependencies installed (`npm install` in workora-backend)
