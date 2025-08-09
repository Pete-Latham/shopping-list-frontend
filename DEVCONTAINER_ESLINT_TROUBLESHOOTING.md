# 🔧 VS Code ESLint Troubleshooting in Devcontainer

## ✅ Current Status
- ✅ ESLint works from command line in devcontainer
- ❌ VS Code not showing ESLint warnings in devcontainer

## 🎯 Step-by-Step Fix

### **Step 1: Reload VS Code Window**
1. **Command Palette**: `Cmd+Shift+P` (or `Ctrl+Shift+P`)
2. **Type**: `Developer: Reload Window`
3. **Press Enter** - This reloads VS Code with the new devcontainer settings

### **Step 2: Restart ESLint Server**
1. **Command Palette**: `Cmd+Shift+P`
2. **Type**: `ESLint: Restart ESLint Server`  
3. **Press Enter**
4. **Wait 10-15 seconds** for restart

### **Step 3: Check ESLint Status**
1. Look at the **bottom status bar** in VS Code
2. You should see **"ESLint"** text (indicates it's running)
3. If you see a ❌ or error icon, there's a configuration issue

### **Step 4: Enable ESLint for Workspace**
1. **Command Palette**: `Cmd+Shift+P`
2. **Type**: `ESLint: Enable ESLint for this Workspace`
3. **Press Enter**

### **Step 5: Test on Known Files**
1. **Open**: `src/App.tsx` 
2. **Look for**: Yellow squiggly lines under code
3. **Hover over yellow lines**: Should show ESLint rule messages
4. **Go to line 160**: Should have nullish coalescing warning

### **Step 6: Check Problems Panel**
1. **Press**: `Cmd+Shift+M` (or `Ctrl+Shift+M`)
2. **Or**: View → Problems
3. **Should show**: ~73 warnings from ESLint

### **Step 7: Check ESLint Output**
1. **Press**: `Cmd+Shift+U` (or `Ctrl+Shift+U`) 
2. **Select**: "ESLint" from dropdown
3. **Look for**: Any error messages or configuration issues

## 🔍 Diagnostic Commands

Run these **inside the devcontainer terminal** to verify:

```bash
# Test specific file - should show 3 warnings
npx eslint src/App.tsx

# Test all files - should show ~73 warnings  
npm run lint

# Test quiet mode - should show 0 errors
npm run lint:quiet

# Check ESLint version
npx eslint --version

# Verify config is found
npx eslint --print-config src/App.tsx | head -20
```

## ❌ Common Issues & Solutions

### Issue: "ESLint is disabled for this workspace"
**Solution**: 
1. `Cmd+Shift+P` → `ESLint: Enable ESLint for this Workspace`

### Issue: No squiggly lines in any files
**Solution**:
1. Check status bar for ESLint status
2. Try opening different `.tsx` files
3. Restart ESLint server

### Issue: "Failed to load configuration"  
**Solution**:
1. Check ESLint output panel for errors
2. Verify `eslint.config.js` exists in `/app/`
3. Try: `npx eslint --print-config src/App.tsx`

### Issue: Status bar shows ESLint but no warnings
**Solution**:
1. Check `eslint.workingDirectories` is set to `["/app"]`
2. Try: `Cmd+Shift+P` → `Developer: Reload Window`

## 🚨 Nuclear Option

If nothing works:
1. **Rebuild container**: `Cmd+Shift+P` → `Dev Containers: Rebuild Container`
2. **Wait for complete rebuild**
3. **Try steps 1-6 again**

## 🎯 Success Indicators

When working correctly, you should see:
- ✅ **Yellow squiggly lines** in TypeScript files
- ✅ **Problems Panel** shows ~73 warnings
- ✅ **Status bar** shows "ESLint" (no error icons)
- ✅ **Hover messages** show ESLint rule names
- ✅ **Auto-fix on save** works for some issues

---

**Start with Steps 1-2 (Reload Window + Restart ESLint Server) - this fixes most devcontainer ESLint issues!** 🎯
