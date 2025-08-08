# Troubleshooting Guide

## Common Development Issues

### CORS Issues

#### Problem
```
Access to XMLHttpRequest at 'http://localhost:3000/shopping-lists' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

#### Solution
✅ **Already Fixed**: The frontend is configured with a Vite proxy to avoid CORS issues.

**Make sure both servers are running:**

1. **Backend server** (port 3000):
   ```bash
   cd ../shopping-list-backend
   npm run dev
   ```

2. **Frontend server** (port 5173):
   ```bash
   cd /path/to/shopping-list-frontend  
   npm run dev
   ```

#### How the Fix Works
- Vite proxy configuration in `vite.config.ts` forwards `/api/*` requests to `http://localhost:3000`
- API client uses `/api` as base URL in development
- This eliminates cross-origin requests during development

### API Connection Issues

#### Problem: "Failed to fetch" or Network Errors

#### Solutions

1. **Check Backend Server Status**
   ```bash
   curl http://localhost:3000/health
   # Should return success response
   ```

2. **Verify Backend Port**
   - Make sure backend is running on port 3000
   - Check backend configuration for port settings

3. **Check Firewall/Network**
   - Ensure ports 3000 and 5173 are not blocked
   - Try accessing `http://localhost:3000/shopping-lists` directly in browser

4. **Environment Variables**
   ```bash
   # Create .env.local if needed (for production API)
   echo "VITE_API_URL=http://your-backend-url" > .env.local
   ```

### Build Issues

#### Problem: TypeScript Compilation Errors

#### Solutions

1. **Check TypeScript Errors**
   ```bash
   npx tsc --noEmit
   ```

2. **Common Fixes**
   - Remove unused imports
   - Add proper type definitions
   - Check interface exports

3. **Clean Build**
   ```bash
   rm -rf dist
   rm -rf node_modules/.vite
   npm run build
   ```

### Mobile Testing Issues

#### Problem: Touch Interactions Not Working

#### Solutions

1. **Check Touch Targets**
   - Ensure minimum 44px size for interactive elements
   - Use browser dev tools to verify sizes

2. **Verify CSS Module Imports**
   ```tsx
   // ✅ Correct
   import styles from './Component.module.css';
   <div className={styles.touchTarget}>
   
   // ❌ Wrong  
   <div className="touchTarget">
   ```

3. **Test on Actual Devices**
   - Use browser dev tools mobile simulation
   - Test on real mobile devices when possible

### Development Server Issues

#### Problem: "EADDRINUSE" Port Already in Use

#### Solutions

1. **Find and Kill Process**
   ```bash
   # Find process on port 5173
   lsof -ti:5173
   
   # Kill the process
   kill -9 $(lsof -ti:5173)
   ```

2. **Use Different Port**
   ```bash
   npm run dev -- --port 5174
   ```

#### Problem: Hot Reload Not Working

#### Solutions

1. **Restart Development Server**
   ```bash
   # Stop server (Ctrl+C)
   # Clear cache and restart
   rm -rf node_modules/.vite
   npm run dev
   ```

2. **Check File Watchers**
   - Ensure files are being saved
   - Check if IDE is interfering with file watching

### Component Issues

#### Problem: Styles Not Applying

#### Solutions

1. **Verify CSS Module Import**
   ```tsx
   // ✅ Correct
   import styles from './Component.module.css';
   
   // ❌ Wrong
   import './Component.module.css';
   ```

2. **Check Class Name Usage**
   ```tsx
   // ✅ Correct
   <div className={styles.container}>
   
   // ❌ Wrong
   <div className="container">
   ```

3. **Browser DevTools**
   - Inspect element to see if classes are applied
   - Check if CSS is being loaded

### Performance Issues

#### Problem: Slow Loading or Large Bundle Size

#### Solutions

1. **Analyze Bundle**
   ```bash
   npm run build
   # Check dist/ folder sizes
   ```

2. **Code Splitting** (Future Enhancement)
   ```tsx
   // Use dynamic imports for large components
   const ShoppingListDetail = lazy(() => import('./components/ShoppingListDetail'));
   ```

3. **Optimize Images and Assets**
   - Use appropriate image formats and sizes
   - Implement lazy loading for images

## Getting Help

### Debug Information to Gather

When reporting issues, include:

1. **Environment**
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - OS and browser

2. **Console Errors**
   - Browser console errors (F12)
   - Terminal error messages
   - Network tab in browser dev tools

3. **Reproduction Steps**
   - What you were trying to do
   - Steps to reproduce the issue
   - Expected vs actual behavior

### Quick Health Check

Run this command to verify your setup:

```bash
# Health check script
echo "🔍 Environment Check"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

echo "📦 Build Check"
npm run build

echo "🔧 Type Check"
npx tsc --noEmit

echo "📱 Dev Server Test"
# This would start dev server briefly
# npm run dev
```

### Useful Commands

```bash
# Clear all caches and reinstall
rm -rf node_modules package-lock.json dist
npm install

# Check for outdated packages
npm outdated

# Update packages (be careful in production)
npm update

# Lint check
npm run lint
```

## Need More Help?

- Check the [Development Standards](./DEVELOPMENT_STANDARDS.md)
- Review the [Quick Reference](./QUICK_REFERENCE.md)  
- Look at existing working components for patterns
- Use browser dev tools for debugging CSS and JavaScript issues
