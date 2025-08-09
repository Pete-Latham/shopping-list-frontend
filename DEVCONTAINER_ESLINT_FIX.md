# 🔧 Fix ESLint in Devcontainer

## ⚠️ Problem
The devcontainer doesn't have the new ESLint plugins we installed locally.

## 🛠️ Solution Options

### **Option 1: Rebuild Container (Recommended)**

In VS Code:
1. Open Command Palette: `Cmd+Shift+P`
2. Type: `Dev Containers: Rebuild Container`
3. Press Enter and wait for rebuild

### **Option 2: Install Plugins Inside Container**

If you're in the devcontainer terminal, run:
```bash
npm install --save-dev eslint-plugin-jsx-a11y eslint-plugin-react-x eslint-plugin-react-dom
```

### **Option 3: Command Line Rebuild**

From your local machine (outside container):
```bash
cd /Users/pete/Projects/shopping-list-frontend

# Stop container
docker-compose -f .devcontainer/docker-compose.yml down

# Remove the node_modules volume to force reinstall
docker volume rm shopping-list-frontend_node_modules 2>/dev/null || true

# Rebuild and start
docker-compose -f .devcontainer/docker-compose.yml up --build -d
```

## ✅ After Rebuild/Install

1. **Test ESLint works**:
   ```bash
   npx eslint src/App.tsx
   ```

2. **Should show 3 warnings** instead of the error

3. **Test full lint**:
   ```bash
   npm run lint
   ```

4. **Should show 73 warnings, 0 errors**

## 🎯 VS Code Integration

After the plugins are installed in the container:

1. **Restart ESLint Server**: `Cmd+Shift+P` → `ESLint: Restart ESLint Server`
2. **Reload Window**: `Cmd+Shift+P` → `Developer: Reload Window`
3. **Check Problems Panel**: `Cmd+Shift+M`

You should now see all the ESLint warnings in VS Code!

---

**Recommendation: Use Option 1 (Rebuild Container) as it ensures everything is clean and consistent.** 🎯
