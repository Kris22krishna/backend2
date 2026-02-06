# 🔍 Installation Verification Guide

Use this checklist to verify your SKILL100.AI installation is complete and working correctly.

## Pre-Installation Checks

### ✅ Step 1: Verify Node.js Installation

Open terminal/command prompt and run:
```bash
node --version
```

**Expected Output:** `v18.x.x` or `v20.x.x` or higher  
**If Not:** Install Node.js from https://nodejs.org/

```bash
npm --version
```

**Expected Output:** `8.x.x` or higher  
**If Not:** Node.js installation should include npm

---

## File Structure Verification

### ✅ Step 2: Verify Root Files

Check that these files exist in the root folder:

```bash
# Windows Command Prompt
dir package.json index.html tsconfig.json vite.config.ts

# Mac/Linux Terminal
ls -la package.json index.html tsconfig.json vite.config.ts
```

**Required Files:**
- [ ] `package.json` ← Most important!
- [ ] `index.html`
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `vite.config.ts`
- [ ] `postcss.config.mjs`

### ✅ Step 3: Verify Source Files

```bash
# Check src folder structure
ls -la src/
ls -la src/app/
ls -la src/app/pages/
ls -la src/app/components/
ls -la src/styles/
```

**Required Structure:**
```
src/
├── main.tsx ← Entry point
├── app/
│   ├── App.tsx ← Main component
│   ├── routes.ts
│   ├── pages/ ← 6 page files
│   └── components/ ← Multiple component files
└── styles/ ← 4 CSS files
```

### ✅ Step 4: Verify Documentation

Quick check:
```bash
ls -la START_HERE.md README.md
```

**Helpful Files:**
- [ ] `START_HERE.md` - Quick start
- [ ] `README.md` - Full documentation
- [ ] `LOCAL_SETUP.md` - Detailed setup
- [ ] Platform-specific guides (WINDOWS_SETUP.md or MAC_LINUX_SETUP.md)

---

## Installation Process Verification

### ✅ Step 5: Install Dependencies

Run the installation:
```bash
npm install
```

**What to Watch For:**

✅ **Good Signs:**
```
npm info it worked if it ends with ok
added XXX packages in XXs
```

❌ **Warning Signs:**
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path .../package.json
```
→ **Solution:** You're not in the project folder. Navigate to project folder first.

```
npm ERR! network
```
→ **Solution:** Check internet connection

**Verification:**
After installation completes, check that `node_modules` folder exists:
```bash
ls -la node_modules
```

Should contain 1000+ folders (all the dependencies)

---

## Application Launch Verification

### ✅ Step 6: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Success Indicators:**
- Server starts without errors
- Port number is displayed (usually 5173)
- No red error messages

❌ **Common Issues:**

**Issue:** "Cannot find module 'vite'"
```
Solution: Run npm install again
```

**Issue:** "Port 5173 already in use"
```
Solution: Vite will auto-select next port (5174, 5175, etc.)
Check the terminal output for actual port number
```

**Issue:** TypeScript errors
```
Solution: Ensure Node.js version 18+
```

### ✅ Step 7: Open in Browser

1. Open browser
2. Navigate to: `http://localhost:5173`
3. Wait for page to load

**Expected Result:**
- Login page appears
- SKILL100.AI branding visible
- Username and password fields present
- No JavaScript errors in browser console

**Check Browser Console:**
- Press `F12` or right-click → Inspect
- Go to "Console" tab
- Should see no red errors

---

## Functionality Verification

### ✅ Step 8: Test Login

**Test Credentials:**
```
Username: teacher
Password: password
```

Or:
```
Username: admin
Password: admin123
```

**Expected Behavior:**
- Form accepts input
- Login button clickable
- Successful redirect to Dashboard
- Sidebar and header appear

### ✅ Step 9: Test Navigation

Click through each menu item:
- [ ] Dashboard - Shows statistics, charts
- [ ] Students - Shows student table
- [ ] Assignments - Shows assignment analytics
- [ ] Attendance - Shows attendance table
- [ ] Settings - Shows settings form

**Expected:** Each page loads without errors

### ✅ Step 10: Test Interactive Features

**On Dashboard:**
- [ ] Click grade tabs (6, 7, 8, 9, 10) - Filtering works
- [ ] Click topic dropdown - Shows math topics
- [ ] Today's schedule loads

**On Assignments:**
- [ ] Click pie chart sections - Modal opens with student list
- [ ] Click bar chart bars - Modal opens with student details
- [ ] Download Excel button works

**On Students:**
- [ ] Click grade tabs - Table filters
- [ ] Download Excel button works

**On Attendance:**
- [ ] Attendance table displays
- [ ] Statistics show correctly
- [ ] Download Excel works

---

## Performance Verification

### ✅ Step 11: Check Performance

**Page Load:**
- [ ] Pages load in < 2 seconds
- [ ] No lag when clicking navigation
- [ ] Charts render smoothly

**Browser Performance:**
- Open DevTools (F12)
- Go to "Performance" or "Network" tab
- Refresh page
- Look for:
  - [ ] Page load < 3 seconds
  - [ ] No failed network requests
  - [ ] No memory leaks

---

## Build Verification (Optional)

### ✅ Step 12: Test Production Build

```bash
npm run build
```

**Expected Output:**
```
vite v6.3.5 building for production...
✓ XXX modules transformed.
dist/index.html                  X.XX kB
dist/assets/index-XXXXX.css      XX.XX kB
dist/assets/index-XXXXX.js       XXX.XX kB
✓ built in XXs
```

✅ **Success:** `dist` folder created with files

Test the build:
```bash
npm run preview
```

**Expected:** Application runs at specified port (usually 4173)

---

## Final Checklist

### ✅ Complete Verification

- [ ] Node.js installed (v18+)
- [ ] All required files present
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] Application loads in browser
- [ ] Login works
- [ ] All pages accessible
- [ ] Interactive features work
- [ ] No console errors
- [ ] Charts display correctly
- [ ] Excel downloads work
- [ ] (Optional) Production build works

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| "node: command not found" | Install Node.js from nodejs.org |
| "Cannot find package.json" | Navigate to project folder |
| "Module not found" | Run `npm install` |
| Port already in use | Vite auto-selects next port |
| Blank page in browser | Check browser console for errors |
| Charts not displaying | Clear browser cache, restart server |
| TypeScript errors | Ensure Node.js 18+ |

---

## Get Help

If verification fails at any step:

1. **Check Documentation:**
   - `START_HERE.md` - Quick guide
   - `LOCAL_SETUP.md` - Detailed setup
   - `WINDOWS_SETUP.md` or `MAC_LINUX_SETUP.md` - Platform specific

2. **Common Fixes:**
   ```bash
   # Delete and reinstall
   rm -rf node_modules
   npm install
   
   # Clear cache
   npm cache clean --force
   
   # Restart server
   # Press Ctrl+C to stop
   npm run dev
   ```

3. **Browser Issues:**
   - Clear cache and cookies
   - Try incognito/private mode
   - Try different browser

---

## Success! 🎉

If all checks pass:
- ✅ Your installation is complete
- ✅ Application is running correctly
- ✅ Ready to use SKILL100.AI
- ✅ Ready to customize or deploy

**Next Steps:**
- Explore all features
- Customize mock data
- Modify styles
- Prepare for deployment

---

**Installation Date:** _______________  
**Verified By:** _______________  
**Node Version:** _______________  
**Status:** ✅ VERIFIED / ❌ ISSUES FOUND
