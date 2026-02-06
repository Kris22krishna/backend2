# Quick Start Checklist ✅

Use this checklist to export and run your Parent Dashboard locally.

## Pre-Flight Checklist

- [ ] I have a computer running Windows, macOS, or Linux
- [ ] I have internet connection for downloading dependencies
- [ ] I have at least 500MB of free disk space

## Installation Checklist

### 1. Install Node.js
- [ ] Go to https://nodejs.org/
- [ ] Download the **LTS version** (v18 or higher)
- [ ] Run the installer
- [ ] Restart computer (if needed)
- [ ] Verify: Open terminal and run `node --version`

### 2. Export Project from Figma Make
- [ ] Download all project files from Figma Make
- [ ] Save to a folder (e.g., `parent-dashboard`)
- [ ] Verify all files are present (check EXPORT-GUIDE.md for full list)

### 3. Set Up Project
- [ ] Open terminal/command prompt
- [ ] Navigate to project folder: `cd path/to/parent-dashboard`
- [ ] Run: `npm install`
- [ ] Wait for installation to complete (2-5 minutes)

### 4. Run Development Server
- [ ] Run: `npm run dev`
- [ ] Wait for server to start
- [ ] Look for: `Local: http://localhost:5173/`
- [ ] Open browser and go to that URL
- [ ] See your dashboard running! 🎉

## Essential Files Checklist

Make sure you have these files after export:

### Root Level
- [ ] `package.json`
- [ ] `vite.config.ts`
- [ ] `postcss.config.mjs`
- [ ] `index.html`
- [ ] `README.md`
- [ ] `EXPORT-GUIDE.md`
- [ ] `.gitignore`

### Source Files (`/src`)
- [ ] `src/main.tsx`
- [ ] `src/app/App.tsx`
- [ ] `src/app/routes.tsx`

### Components (`/src/app/components`)
- [ ] `src/app/components/DashboardLayout.tsx`
- [ ] All UI components in `src/app/components/ui/`

### Pages (`/src/app/pages`)
- [ ] `src/app/pages/DashboardPage.tsx`
- [ ] `src/app/pages/QuizzesPage.tsx`
- [ ] `src/app/pages/SkillsPage.tsx`
- [ ] `src/app/pages/ProgressPage.tsx`
- [ ] `src/app/pages/ReportsPage.tsx`
- [ ] `src/app/pages/SettingsPage.tsx`
- [ ] `src/app/pages/NotificationsPage.tsx`

### Styles (`/src/styles`)
- [ ] `src/styles/index.css`
- [ ] `src/styles/tailwind.css`
- [ ] `src/styles/theme.css`
- [ ] `src/styles/fonts.css`

## Troubleshooting Checklist

If something isn't working:

- [ ] Node.js is installed (`node --version` works)
- [ ] npm is installed (`npm --version` works)
- [ ] I'm in the correct folder (`pwd` or `cd` shows project path)
- [ ] Dependencies are installed (I see `node_modules` folder)
- [ ] No error messages in terminal
- [ ] Port 5173 is not blocked by firewall
- [ ] Browser console (F12) shows no errors

## Common Commands Reference

```bash
# Navigate to project
cd path/to/parent-dashboard

# Install dependencies (only needed once)
npm install

# Start development server
npm run dev

# Stop server
Ctrl + C (or Cmd + C on Mac)

# Build for production
npm run build

# Preview production build
npm run preview

# Check Node.js version
node --version

# Check npm version
npm --version
```

## Success Indicators

You'll know it's working when:

✅ Terminal shows: `VITE v6.3.5 ready`
✅ Terminal shows: `Local: http://localhost:5173/`
✅ Browser opens and displays the Parent Dashboard
✅ You see the navigation sidebar with Dashboard, Quizzes, Skills, Progress, Reports
✅ You can click around and navigate between pages
✅ Charts and data are visible
✅ The fox mascot appears on various pages

## File Structure Quick Reference

```
parent-dashboard/
├── src/               ← All source code
│   ├── app/          ← React components
│   ├── styles/       ← CSS files
│   └── main.tsx      ← Entry point
├── node_modules/     ← Dependencies (created by npm install)
├── dist/             ← Production build (created by npm run build)
├── index.html        ← HTML template
└── package.json      ← Project configuration
```

## Next Steps After Setup

Once everything is running:

1. [ ] Explore the dashboard - click through all pages
2. [ ] Open project in code editor (VS Code recommended)
3. [ ] Try making a small change (e.g., edit text in DashboardPage.tsx)
4. [ ] Save and watch it update in browser automatically
5. [ ] Read README.md for more details about the project
6. [ ] Bookmark this checklist for future reference

## Getting Help

If you're stuck:

1. **Check EXPORT-GUIDE.md** - Detailed troubleshooting section
2. **Read error messages** - They often tell you exactly what's wrong
3. **Google the error** - Copy exact error message to search
4. **Check browser console** - Press F12 to see JavaScript errors
5. **Try reinstalling** - Delete `node_modules` and run `npm install` again

## Terminal Command Cheat Sheet

**Windows (CMD/PowerShell):**
```cmd
dir              # List files in current folder
cd foldername    # Enter a folder
cd ..            # Go up one folder
cls              # Clear screen
```

**macOS/Linux (Terminal):**
```bash
ls               # List files in current folder
cd foldername    # Enter a folder
cd ..            # Go up one folder
clear            # Clear screen
pwd              # Show current path
```

---

**Remember:** The first time setup takes the longest. After that, you just need to:
1. Open terminal
2. Navigate to project folder (`cd path/to/parent-dashboard`)
3. Run `npm run dev`
4. Open browser to `http://localhost:5173`

Happy coding! 🚀
