# VSCode Dev Container Troubleshooting

This guide helps resolve common issues with VSCode Dev Containers.

## 🔧 Quick Fixes

### 1. **"Reopen in Container" Fails**

**Try these solutions in order:**

#### Solution A: Use Simple Configuration
```bash
# Rename current config
mv .devcontainer/devcontainer.json .devcontainer/devcontainer-complex.json

# Use simple config
mv .devcontainer/devcontainer-simple.json .devcontainer/devcontainer.json

# Try "Reopen in Container" again
```

#### Solution B: Build Development Image First
```bash
# Build the development image manually
docker build -f Dockerfile.dev -t shopping-list-frontend:dev .

# Try "Reopen in Container" again
```

#### Solution C: Clean Docker State
```bash
# Remove existing containers
docker rm -f shopping-list-frontend-devcontainer

# Remove volumes
docker volume rm shopping-list-frontend-node-modules

# Restart Docker Desktop
# Try "Reopen in Container" again
```

### 2. **Container Starts but VSCode Can't Connect**

#### Check Container Status
```bash
# See if container is running
docker ps | grep shopping-list-frontend

# Check container logs
docker logs shopping-list-frontend-devcontainer
```

#### Fix Permission Issues (Linux/macOS)
```bash
# Fix file permissions
sudo chown -R $(id -u):$(id -g) .

# Restart container
docker restart shopping-list-frontend-devcontainer
```

### 3. **Hot Reload Not Working**

#### Check Volume Mounts
```bash
# Inspect container mounts
docker inspect shopping-list-frontend-devcontainer | grep -A 10 "Mounts"
```

#### Manual Fix
```bash
# Stop container
docker stop shopping-list-frontend-devcontainer

# Remove container
docker rm shopping-list-frontend-devcontainer

# Restart VSCode dev container
```

## 🐛 Common Error Messages

### Error: "Failed to connect to the remote extension host server"

**Solution:**
```bash
# 1. Close VSCode
# 2. Clean up containers
docker rm -f $(docker ps -aq --filter "name=shopping-list")

# 3. Remove dev container volumes
docker volume prune

# 4. Restart VSCode and try again
```

### Error: "Port 5173 is already in use"

**Solution:**
```bash
# Find what's using the port
lsof -i :5173

# Kill the process (if it's safe)
kill -9 [PID]

# Or change port in devcontainer.json
# "forwardPorts": [3000],  // Use different port
```

### Error: "Docker daemon not running"

**Solution:**
1. Start Docker Desktop
2. Wait for it to fully load
3. Try "Reopen in Container" again

### Error: "No such file or directory: Dockerfile.dev"

**Solution:**
```bash
# Make sure you're in the project root
pwd
# Should show: .../shopping-list-frontend

# Check if Dockerfile.dev exists
ls -la Dockerfile.dev
```

### Error: "env: can't execute 'bash': No such file or directory" (Features failing)

**Problem:** VSCode dev container features expect bash, but Alpine Linux only has sh.

**Solution A: Use Alpine config without features (current setup)**
```bash
# Current devcontainer.json already fixed this
# Features are disabled to avoid Alpine compatibility issues
```

**Solution B: Switch to Ubuntu-based config**
```bash
# Use Ubuntu-based dev container that supports features
mv .devcontainer/devcontainer.json .devcontainer/devcontainer-alpine.json
mv .devcontainer/devcontainer-ubuntu.json .devcontainer/devcontainer.json

# Try "Reopen in Container" again
```

### Error: "mkdir: can't create directory '/home/appuser/': Permission denied"

**Problem:** VSCode tries to create user directories but the container user setup conflicts.

**Solution A: Use root user config (simplest)**
```bash
# Use root-based dev container (avoids all permission issues)
mv .devcontainer/devcontainer.json .devcontainer/devcontainer-appuser.json
mv .devcontainer/devcontainer-root.json .devcontainer/devcontainer.json

# Try "Reopen in Container" again
```

**Solution B: Fix current config**
```bash
# Current config already updated to run as root
# Just retry "Reopen in Container"
```

## 🔄 Alternative Approaches

### Option 1: Manual Container Setup
```bash
# Build and run container manually
docker build -f Dockerfile.dev -t frontend-dev .
docker run -it -p 5173:5173 -v $(pwd):/app -v /app/node_modules frontend-dev

# Open VSCode and connect to running container:
# Command Palette > "Dev Containers: Attach to Running Container"
```

### Option 2: Use Docker Compose Directly
```bash
# Start with docker-compose
docker-compose -f .devcontainer/docker-compose.yml up -d frontend-dev

# Attach VSCode to running container
```

### Option 3: Use Remote-SSH Instead
If dev containers continue to fail, use native development:
```bash
# Just use native development
npm install
npm run dev

# Still get great VSCode experience
```

## 📊 Debugging Commands

### Check Docker Status
```bash
# Docker version
docker --version

# Docker info
docker info

# Running containers
docker ps

# All containers
docker ps -a

# Images
docker images

# Volumes
docker volume ls

# Networks
docker network ls
```

### Check VSCode Extension
```bash
# Command Palette (Cmd/Ctrl + Shift + P):
# - "Dev Containers: Show Container Log"
# - "Dev Containers: Inspect Container"
# - "Dev Containers: Show All Logs"
```

### Reset Everything
```bash
# Nuclear option - reset everything
./scripts/dev.sh clean
docker system prune -af
docker volume prune -f

# Restart Docker Desktop
# Restart VSCode
# Try again
```

## 🎯 Best Practices

1. **Keep Docker Desktop Updated**
2. **Keep VSCode Dev Containers Extension Updated**
3. **Use Simple Configuration First** - get it working, then add complexity
4. **Check Docker Resources** - Ensure enough RAM/disk space
5. **Try Native Development** - As fallback if containers don't work

## 📞 Getting Help

If all else fails:

1. **Check VSCode logs**: View → Output → Dev Containers
2. **Check Docker logs**: `docker logs [container-name]`
3. **Use native development**: `npm run dev`
4. **Ask for help** with specific error messages

Remember: **Native development works perfectly fine** - containers are just a nice-to-have for consistency!
