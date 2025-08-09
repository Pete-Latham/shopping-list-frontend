# API Configuration Guide

This document explains how the frontend connects to the backend API and how to control mock vs real data.

## Default Behavior (RECOMMENDED)

By default, the frontend will **always attempt to connect to the real backend API**. If the connection fails, the app will show an error instead of silently falling back to mock data. This makes backend connectivity issues obvious.

- ✅ **Real API failures are visible**
- ✅ **No silent fallback to mock data**
- ✅ **DevBanner shows connection status**

## API Connection Methods

### 1. Dev Container (VSCode)
- **URL**: `http://host.docker.internal:3000`
- **Set by**: `VITE_API_URL` in dev container environment
- **Direct connection** to host backend

### 2. Host Development (npm run dev)
- **URL**: `/api` (proxied to `http://localhost:3000`)  
- **Set by**: Vite proxy configuration in `vite.config.ts`
- **Proxy avoids CORS issues**

## Mock Data Mode

Mock data is **opt-in only** to prevent masking backend connection issues.

### Enable Mock Data
```bash
# Using the helper script
./scripts/toggle-mock-api.sh enable

# Or manually create .env.local
echo "VITE_USE_MOCK_API=true" > .env.local
```

### Disable Mock Data (Default)
```bash
# Using the helper script
./scripts/toggle-mock-api.sh disable

# Or manually remove from .env.local
rm .env.local
```

### Check Current Status
```bash
./scripts/toggle-mock-api.sh status
```

## Development Banner

The DevBanner component shows the current API mode:

- 🔗 **"Connected to Backend API"** - Real API working
- ⚠️ **"Backend API Error - Check Console"** - Real API failed
- 📦 **"Using Mock Data"** - Mock API enabled via `VITE_USE_MOCK_API=true`

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_URL` | Override API base URL | `/api` (uses proxy) |
| `VITE_USE_MOCK_API` | Force mock data usage | `false` |

## Troubleshooting

### Frontend shows errors instead of data
1. ✅ **This is correct behavior!** The backend is not reachable
2. Check backend is running: `curl http://localhost:3000/health`
3. Check Docker containers: `docker ps`
4. If you need to work with mock data: `./scripts/toggle-mock-api.sh enable`

### DevBanner shows "Backend API Error"
1. Check console for detailed error messages
2. Verify backend is running and accessible
3. Test direct connection: `curl http://localhost:3000/health`

### Want to test with mock data
```bash
./scripts/toggle-mock-api.sh enable
# Restart your dev server
npm run dev  # or restart dev container
```

## Benefits of This Approach

1. **No Silent Failures**: Backend issues are immediately visible
2. **Clear Development Feedback**: DevBanner shows exact connection status
3. **Explicit Mock Usage**: Mock data only when intentionally enabled
4. **Easy Testing**: Toggle script makes switching modes simple
5. **Better Debugging**: Real API errors are logged to console

This approach prevents the common issue where developers think their backend integration is working when it's actually falling back to mock data.
