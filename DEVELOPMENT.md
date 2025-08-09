# Development Guide

This guide covers both **native development** (traditional Node.js setup) and **containerized development** workflows for the Shopping List Frontend.

## 🚀 Quick Start Options

### Option 1: Native Development (Traditional)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Option 2: Containerized Development (Recommended)
```bash
# Build and start full development stack
./scripts/dev.sh start-dev

# Or start only frontend container
./scripts/dev.sh start-frontend-only

# Open browser to http://localhost:5173
```

### Option 3: VSCode Dev Containers
1. Install the "Dev Containers" extension
2. Open project in VSCode
3. Click "Reopen in Container" when prompted
4. VSCode will automatically set up the development environment

## 🐳 Containerized Development

### Benefits
- **Consistent environment** across all developers
- **No local Node.js version conflicts**
- **Isolated dependencies** and services
- **Easy onboarding** for new team members
- **Production parity** - same environment as deployment

### Available Configurations

#### 1. Full Development Stack
**File:** `docker-compose.dev.yml`
**Usage:** `./scripts/dev.sh start-dev`

Includes:
- Frontend with hot reload
- Backend API
- PostgreSQL database
- Development tools container

#### 2. Frontend-Only Container
**File:** `docker-compose.frontend-dev.yml`
**Usage:** `./scripts/dev.sh start-frontend-only`

Includes:
- Frontend with hot reload
- Connects to host machine's backend/database

#### 3. VSCode Dev Container
**File:** `.devcontainer/devcontainer.json`
**Usage:** VSCode "Reopen in Container"

Includes:
- Full development environment in VSCode
- Pre-configured extensions
- Automatic port forwarding
- Integrated terminal

## 📁 Development Files Structure

```
├── Dockerfile                     # Production build
├── Dockerfile.dev                 # Development build
├── docker-compose.yml            # Production stack
├── docker-compose.dev.yml        # Full dev stack
├── docker-compose.frontend-dev.yml # Frontend-only dev
├── scripts/
│   └── dev.sh                    # Development helper script
├── .devcontainer/
│   └── devcontainer.json         # VSCode dev container config
└── docker/
    ├── nginx.conf                # Production nginx config
    ├── nginx-standalone.conf     # Standalone nginx config
    ├── healthcheck.sh           # Health check script
    └── init-dev.sql             # Development database data
```

## 🛠 Development Helper Script

The `scripts/dev.sh` script provides convenient commands:

```bash
# Build development image
./scripts/dev.sh build-dev

# Start full development environment
./scripts/dev.sh start-dev

# Start frontend-only container  
./scripts/dev.sh start-frontend-only

# Stop all development services
./scripts/dev.sh stop-dev

# View logs
./scripts/dev.sh logs [service]

# Open shell in container
./scripts/dev.sh shell [service]

# Install npm package
./scripts/dev.sh install [package]

# Run tests in container
./scripts/dev.sh test

# Run linter in container
./scripts/dev.sh lint

# Clean up everything
./scripts/dev.sh clean

# Reset environment (clean + rebuild)
./scripts/dev.sh reset

# Show container status
./scripts/dev.sh status

# Show help
./scripts/dev.sh help
```

## 🔧 Development Features

### Hot Reload
- **Native:** Vite's built-in hot reload
- **Container:** Volume mounts enable file watching
- **Changes reflect immediately** in both modes

### Debugging
- **Frontend:** Browser DevTools work normally
- **Container:** Supports remote debugging
- **VSCode:** Integrated debugging in dev containers

### Database
- **Development data** automatically loaded
- **Separate dev database** (port 5433)
- **Sample shopping lists** and items included

### Environment Variables
```bash
# Development-specific variables
NODE_ENV=development
VITE_API_URL=http://localhost:3000  # or container name
DB_PASSWORD=devpassword  # Development only
```

## 🚀 Workflow Examples

### Daily Development (Containerized)
```bash
# Start your day
./scripts/dev.sh start-dev

# Make code changes (files are watched automatically)
# Test your changes at http://localhost:5173

# View logs if needed
./scripts/dev.sh logs frontend-dev

# Install a new package
./scripts/dev.sh install axios

# Run tests
./scripts/dev.sh test

# End your day
./scripts/dev.sh stop-dev
```

### Team Onboarding (New Developer)
```bash
# 1. Clone repository
git clone [repo-url]
cd shopping-list-frontend

# 2. Start development environment
./scripts/dev.sh start-dev

# 3. Open http://localhost:5173
# That's it! No Node.js installation needed
```

### VSCode Development
```bash
# 1. Open project in VSCode
code .

# 2. Install "Dev Containers" extension
# 3. Press F1 -> "Dev Containers: Reopen in Container"
# 4. VSCode handles everything automatically
```

## 🔄 Switching Between Native and Containerized

### From Native to Container
```bash
# Stop native development server (Ctrl+C)
./scripts/dev.sh start-frontend-only
```

### From Container to Native  
```bash
./scripts/dev.sh stop-dev
npm run dev
```

## 📊 Performance Comparison

| Aspect | Native | Container |
|--------|--------|-----------|
| **Startup Time** | ⚡ Fast | 🐌 Slower initial |
| **Hot Reload** | ⚡ Instant | ⚡ Instant |
| **File Watching** | ⚡ Direct | 🔄 Via volumes |
| **Memory Usage** | 💾 Lower | 💾 Higher |
| **Consistency** | ❌ Variable | ✅ Identical |
| **Onboarding** | 🔧 Manual setup | ⚡ Automatic |

## 🐛 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check if ports are in use
lsof -i :5173 -i :3000 -i :5433

# Clean up and rebuild
./scripts/dev.sh reset
```

#### File Changes Not Detected
```bash
# On macOS/Windows, try increasing file watcher limits
# Or restart the development environment
./scripts/dev.sh restart-dev
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R $(id -u):$(id -g) .
```

#### Database Connection Issues
```bash
# Check database health
./scripts/dev.sh logs postgres-dev

# Reset database
./scripts/dev.sh clean
./scripts/dev.sh start-dev
```

### Getting Help
```bash
# Show container status
./scripts/dev.sh status

# View all logs
./scripts/dev.sh logs

# Open shell for debugging
./scripts/dev.sh shell frontend-dev
```

## 🎯 Best Practices

1. **Use containers for team consistency**
2. **Native development for quick experiments**
3. **VSCode dev containers for integrated experience**
4. **Regular cleanup** of Docker resources
5. **Keep development data in sync** with production schema
6. **Test both environments** before pushing changes

Choose the approach that works best for your workflow and team setup!
