# Workora VPS Deployment Guide

## VPS Details

**Server Information:**
- **IP Address:** 4.221.170.153
- **Provider:** Azure (Debian GNU/Linux)
- **Hostname:** lewis
- **SSH User:** azureuser
- **Project Owner:** lewis

## SSH Access

```bash
ssh azureuser@4.221.170.153
```

## Project Location

**Main Project Directory:** `/home/lewis/workora-platform`

```bash
cd /home/lewis/workora-platform
```

**Important:** The project is owned by user `lewis` but you log in as `azureuser`, so you need `sudo` for git and docker operations.

## Git Configuration

The repository has a permission issue that needs to be fixed once:

```bash
sudo git config --global --add safe.directory /home/lewis/workora-platform
```

## Docker Containers

**Running Containers:**

1. **Backend Container**
   - Name: `workora-platform_backend_1`
   - Image: `workora-platform_backend`
   - Port: `3001` (host) → `3001` (container)
   - Working Dir: `/home/lewis/workora-platform`

2. **Redis Container**
   - Name: `workora-platform_redis_1`
   - Image: `redis:alpine`
   - Port: `6379` (host) → `6379` (container)

## Deployment Commands

### Manual Deployment (Pull Latest Code)

```bash
# Navigate to project
cd /home/lewis/workora-platform

# Fix git permissions (run once if needed)
sudo git config --global --add safe.directory /home/lewis/workora-platform

# Pull latest code
sudo git pull origin main

# Rebuild and restart containers
sudo docker-compose up -d --build

# Check container status
sudo docker-compose ps
```

### Check Container Logs

```bash
# View backend logs
sudo docker logs workora-platform_backend_1

# View backend logs (follow)
sudo docker logs -f workora-platform_backend_1

# View redis logs
sudo docker logs workora-platform_redis_1
```

### Restart Containers

```bash
cd /home/lewis/workora-platform

# Restart all services
sudo docker-compose restart

# Restart specific service
sudo docker-compose restart backend
```

### Stop/Start Containers

```bash
cd /home/lewis/workora-platform

# Stop all services
sudo docker-compose down

# Start all services
sudo docker-compose up -d
```

## Project Structure on VPS

```
/home/lewis/workora-platform/
├── workora-backend/
│   ├── src/
│   ├── node_modules/
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── workora-web/
│   └── ...
├── workora-app/
│   └── ...
├── docker-compose.yml
└── .git/
```

## GitHub Actions Auto-Deploy

**Workflow File:** `.github/workflows/deploy.yml`

**Trigger:** Automatically deploys on push to `main` branch

**What it does:**
1. SSH into VPS as `azureuser`
2. Navigate to `/home/lewis/workora-platform`
3. Pull latest code from GitHub
4. Rebuild Docker containers
5. Restart services

**GitHub Secret Required:**
- `VPS_PASSWORD` - Password for azureuser

## Troubleshooting

### Git Permission Issues

If you see "detected dubious ownership in repository":

```bash
sudo git config --global --add safe.directory /home/lewis/workora-platform
```

### Docker Permission Issues

If you see "permission denied while trying to connect to Docker daemon":

```bash
# Add your user to docker group (one-time setup)
sudo usermod -aG docker azureuser

# Log out and back in for changes to take effect
exit
ssh azureuser@4.221.170.153
```

### Container Not Starting

```bash
# Check container status
sudo docker-compose ps

# View container logs
sudo docker logs workora-platform_backend_1

# Rebuild containers from scratch
cd /home/lewis/workora-platform
sudo docker-compose down
sudo docker-compose up -d --build
```

### Check Backend Health

```bash
# Check if backend is responding
curl http://localhost:3001/health

# Or from your local machine
curl http://4.221.170.153:3001/health
```

## Backend Environment Variables

**Location:** `/home/lewis/workora-platform/workora-backend/.env`

To edit:
```bash
sudo nano /home/lewis/workora-platform/workora-backend/.env
```

After editing, restart containers:
```bash
cd /home/lewis/workora-platform
sudo docker-compose restart backend
```

## Database Access

The PostgreSQL database connection details are in the backend `.env` file.

To access the database, you'll need to connect using the credentials specified there.

## Monitoring

### Check Disk Space

```bash
df -h
```

### Check Memory Usage

```bash
free -h
```

### Check Docker Resource Usage

```bash
sudo docker stats
```

## Quick Reference Commands

```bash
# SSH into VPS
ssh azureuser@4.221.170.153

# Go to project
cd /home/lewis/workora-platform

# Pull and deploy
sudo git pull origin main && sudo docker-compose up -d --build

# View logs
sudo docker logs -f workora-platform_backend_1

# Restart services
sudo docker-compose restart

# Check status
sudo docker-compose ps
```

## Important Notes

1. Always use `sudo` for git and docker commands since the project is owned by `lewis`
2. The GitHub Actions workflow automatically deploys when you push to `main`
3. Make sure the `VPS_PASSWORD` secret is set in GitHub repository settings
4. Backend runs on port 3001
5. Redis runs on port 6379

## Support

For issues, check:
1. Container logs: `sudo docker logs workora-platform_backend_1`
2. Docker status: `sudo docker-compose ps`
3. Backend health: `curl http://localhost:3001/health`
