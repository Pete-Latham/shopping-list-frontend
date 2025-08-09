# Synology DS224+ Deployment Guide

This guide covers deploying the Shopping List application stack on your Synology DS224+ NAS using Container Manager.

## 🚀 Quick Start

### Prerequisites
- Synology DSM 7.0+ with Container Manager installed
- SSH access to your NAS (optional, for advanced setup)
- At least 2GB RAM available for containers

### Option 1: Using Container Manager UI

1. **Open Container Manager** in DSM
2. **Go to Registry** → Search for "postgres" → Download `postgres:15-alpine`
3. **Create Project** → Upload the `docker-compose.yml` file
4. **Configure Environment** → Set database password
5. **Deploy** → Start all services

### Option 2: SSH Deployment (Recommended)

```bash
# 1. SSH into your Synology NAS
ssh admin@your-nas-ip

# 2. Navigate to docker directory (create if needed)
sudo mkdir -p /volume1/docker/shopping-list
cd /volume1/docker/shopping-list

# 3. Copy your project files here (via SFTP, git, etc.)
# Files needed:
# - docker-compose.yml
# - Dockerfile  
# - docker/ directory with configs
# - Built frontend files or source code

# 4. Create environment file
cp .env.example .env
sudo nano .env  # Edit with your settings

# 5. Deploy the stack
sudo docker-compose up -d

# 6. Check status
sudo docker-compose ps
sudo docker-compose logs -f
```

## 📋 Configuration

### Port Configuration
Default ports in docker-compose.yml:
- **Frontend**: 8080 → 80 (container)
- **Backend**: 3000 → 3000 (container)  
- **Database**: 5432 → 5432 (container)

**Adjust ports in docker-compose.yml if conflicts exist with other services.**

### Environment Variables
Create `.env` file with:
```bash
DB_PASSWORD=your_secure_password
FRONTEND_PORT=8080  # Adjust if port 8080 is taken
BACKEND_PORT=3000   # Adjust if needed
```

### Network Configuration
The stack creates an isolated `shopping-list-network` for service communication.

## 🔧 Synology-Specific Optimizations

### 1. Volume Mapping
Map container volumes to NAS storage:
```yaml
volumes:
  - /volume1/docker/shopping-list/data:/var/lib/postgresql/data
  - /volume1/docker/shopping-list/logs:/var/log
```

### 2. Resource Limits
Add to each service in docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
```

### 3. Automatic Startup
Set `restart: unless-stopped` on all services (already configured).

### 4. DSM Integration
Configure in DSM Control Panel → Login Portal → Applications:
- Add custom application pointing to `http://localhost:8080`
- Set icon and display name

## 🌐 Reverse Proxy Setup

### Using Synology Reverse Proxy
1. **Control Panel** → **Application Portal** → **Reverse Proxy**
2. **Create** new rule:
   - Source: `shopping-list.your-domain.com` (port 80/443)
   - Destination: `localhost:8080`

### Using Traefik (Advanced)
The docker-compose.yml includes Traefik labels. Deploy Traefik separately:
```bash
# Add to your existing Traefik setup or deploy Traefik stack
version: '3.8'
services:
  traefik:
    image: traefik:v2.10
    ports:
      - "80:80"
      - "443:443"
    # ... Traefik configuration
```

## 🔐 SSL/HTTPS Configuration

### Option 1: Let's Encrypt (Recommended)
Use Synology's built-in Let's Encrypt:
1. **Control Panel** → **Security** → **Certificate**
2. **Add** → Let's Encrypt certificate
3. Configure reverse proxy to use HTTPS

### Option 2: Manual SSL
```yaml
# Add to nginx.conf
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    # ... rest of config
}
```

## 📊 Monitoring & Maintenance

### Health Checks
All services include health checks:
```bash
# Check service health
sudo docker-compose ps

# View health check logs  
sudo docker inspect shopping-list-frontend --format='{{.State.Health.Status}}'
```

### Log Management
```bash
# View logs
sudo docker-compose logs frontend
sudo docker-compose logs backend
sudo docker-compose logs postgres

# Follow logs in real-time
sudo docker-compose logs -f
```

### Updates
```bash
# Pull latest images
sudo docker-compose pull

# Recreate containers with new images
sudo docker-compose up -d --force-recreate

# Remove old images
sudo docker image prune
```

### Backup
```bash
# Backup database
sudo docker-compose exec postgres pg_dump -U postgres shopping_list > backup.sql

# Backup entire stack
sudo docker-compose down
sudo tar -czf shopping-list-backup.tar.gz /volume1/docker/shopping-list/
sudo docker-compose up -d
```

## 🎯 Performance Tuning

### Database Optimization
```sql
-- Connect to database and run
ALTER SYSTEM SET shared_buffers = '128MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
SELECT pg_reload_conf();
```

### Nginx Caching
Already configured in `docker/nginx.conf`:
- Static assets cached for 1 year
- HTML cached for 1 day
- Gzip compression enabled

## 🚨 Troubleshooting

### Common Issues

**Port Conflicts:**
```bash
# Check what's using a port
sudo netstat -tlnp | grep :8080

# Change port in docker-compose.yml
```

**Permission Issues:**
```bash
# Fix file permissions
sudo chown -R admin:users /volume1/docker/shopping-list/
sudo chmod -R 755 /volume1/docker/shopping-list/
```

**Container Won't Start:**
```bash
# Check logs
sudo docker-compose logs service-name

# Restart specific service
sudo docker-compose restart frontend
```

**Database Connection Issues:**
- Check `DB_HOST=postgres` in backend environment
- Ensure database container is healthy before backend starts
- Verify network connectivity: `sudo docker-compose exec backend ping postgres`

### Resource Monitoring
```bash
# Monitor container resources
sudo docker stats

# Check disk usage
sudo docker system df
```

## 📱 Mobile Access

### Local Network Access
- Access via `http://nas-ip:8080`
- Configure port forwarding for external access

### VPN Access
Use Synology VPN Server package for secure external access.

### Mobile App Integration
Consider creating DSM shortcuts or using Synology mobile apps.

## 🔄 Backup Strategy

1. **Automated Database Backups**
2. **Container Configuration Backups**  
3. **Application Data Backups**
4. **Disaster Recovery Plan**

This setup provides a robust, scalable, and maintainable deployment suitable for home/small business use on your Synology NAS.
