#!/bin/bash
set -e

echo "🚀 Deploying latest changes and reseeding database..."

# Navigate to project directory
cd /home/lewis/workora-platform

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git stash
git pull origin main

# Rebuild and restart Docker containers
echo "🔄 Rebuilding Docker containers..."
sudo docker-compose down
sudo docker-compose up -d --build

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Run seed script
echo "🌱 Seeding database with realistic data..."
cd workora-backend
node seed_realistic_data.js

echo "✅ Deployment and seeding complete!"
echo ""
echo "Testing feed endpoint..."
curl "http://localhost:3001/gigs/feed?page=1&limit=5"
