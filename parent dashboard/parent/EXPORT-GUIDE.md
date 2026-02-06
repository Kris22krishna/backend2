# Export and Local Setup Guide

This guide will walk you through exporting your Parent Dashboard from Figma Make and running it on your local machine.

## Step 1: Export Files from Figma Make

### Option A: Manual Download (Recommended)

1. **In Figma Make**, you should see an option to download/export your project
2. **Download all files** - Make sure you get the complete project structure
3. **Save to a folder** on your computer (e.g., `~/Documents/parent-dashboard`)

### Option B: Copy Files Manually

If there's no direct export option, you'll need to copy each file:

#### Essential Files to Copy:

**Root Level:**
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `postcss.config.mjs` - PostCSS configuration
- `index.html` - HTML entry point
- `tsconfig.json` - TypeScript configuration (if present)
- `.gitignore` - Git ignore rules
- `README.md` - Documentation

**Source Files (`/src` folder):**
- `src/main.tsx` - Application entry point
- `src/app/App.tsx` - Main app component
- `src/app/routes.tsx` - Route definitions
- `src/app/components/DashboardLayout.tsx` - Layout component
- All files in `src/app/components/ui/` - UI components
- All files in `src/app/pages/` - Page components
- All files in `src/styles/` - Style files

## Step 2: Verify Folder Structure

After downloading, your folder should look like this:

```
parent-dashboard/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── ... (other UI components)
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── QuizzesPage.tsx
│   │   │   ├── SkillsPage.tsx
│   │   │   ├── ProgressPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── NotificationsPage.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── routes.tsx
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   ├── theme.css
│   │   └── fonts.css
│   │
│   └── main.tsx
│
├── index.html
├── package.json
├── vite.config.ts
├── postcss.config.mjs
├── .gitignore
└── README.md
```

## Step 3: Install Node.js (If Not Already Installed)

### Windows:
1. Go to https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Follow the installation wizard (use default settings)
5. Restart your computer

### macOS:
1. Go to https://nodejs.org/
2. Download the **LTS** version
3. Run the installer package
4. Follow the installation steps

**OR** use Homebrew:
```bash
brew install node
```

### Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verify Installation:
```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

## Step 4: Open Terminal/Command Prompt

### Windows:
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**OR** right-click in your project folder while holding Shift → "Open PowerShell window here"

### macOS:
- Press `Cmd + Space`
- Type `terminal`
- Press Enter

**OR** right-click folder → Services → "New Terminal at Folder"

### Linux:
- Press `Ctrl + Alt + T`

**OR** right-click in folder → "Open Terminal Here"

## Step 5: Navigate to Project Folder

Use the `cd` (change directory) command:

```bash
# Replace with your actual path
cd ~/Documents/parent-dashboard

# Windows example:
cd C:\Users\YourName\Documents\parent-dashboard

# macOS/Linux example:
cd ~/Documents/parent-dashboard
```

**Tip:** You can drag the folder into the terminal window to auto-fill the path!

## Step 6: Install Dependencies

Run the following command in your project folder:

```bash
npm install
```

This will:
- Read `package.json`
- Download all required packages
- Create a `node_modules` folder
- Take 2-5 minutes depending on your internet speed

You should see progress bars and package names scrolling by.

### Alternative: Use pnpm (Faster)

```bash
# Install pnpm globally first
npm install -g pnpm

# Then install dependencies
pnpm install
```

## Step 7: Start Development Server

```bash
npm run dev
```

You should see output like:

```
  VITE v6.3.5  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Step 8: Open in Browser

1. **Hold Ctrl (or Cmd on Mac)** and **click** the `http://localhost:5173/` link in the terminal

**OR**

2. Open your web browser manually
3. Type `http://localhost:5173` in the address bar
4. Press Enter

You should now see your Parent Dashboard running!

## Step 9: Making Changes

While the development server is running:

1. **Edit any file** in your code editor (VS Code, Sublime, etc.)
2. **Save the file**
3. **The browser will automatically refresh** with your changes (Hot Module Replacement)

## Step 10: Stop the Server

When you're done:
- Press `Ctrl + C` in the terminal
- Type `y` if prompted to confirm

## Common Issues & Solutions

### Issue 1: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH. Reinstall Node.js and restart your terminal.

### Issue 2: "Permission denied" or "EACCES"
**Solution (macOS/Linux):**
```bash
sudo chown -R $USER /usr/local/lib/node_modules
```

**Solution (Windows):** Run terminal as Administrator

### Issue 3: Port 5173 already in use
**Solution:** Vite will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the actual URL.

**OR** kill the process using that port:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -ti:5173 | xargs kill
```

### Issue 4: "Cannot find module" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: Blank white screen
**Solution:**
1. Check browser console (F12) for errors
2. Make sure `index.html` exists in root
3. Make sure `src/main.tsx` exists
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue 6: Styles not loading
**Solution:**
1. Make sure all files in `src/styles/` are present
2. Check that `src/styles/index.css` is imported in `src/main.tsx`
3. Clear Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Building for Production

When you're ready to deploy your application:

```bash
# Create production build
npm run build

# This creates a 'dist' folder with optimized files
```

Preview the production build locally:

```bash
npm run preview
```

The `dist` folder can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting
- etc.

## Recommended Code Editors

For the best development experience:

1. **Visual Studio Code** (Recommended)
   - Download: https://code.visualstudio.com/
   - Extensions to install:
     - ESLint
     - Prettier
     - Tailwind CSS IntelliSense
     - ES7+ React/Redux/React-Native snippets

2. **WebStorm** (Paid)
   - Download: https://www.jetbrains.com/webstorm/

3. **Sublime Text** (Lightweight)
   - Download: https://www.sublimetext.com/

## Next Steps

1. **Learn the codebase** - Explore the files and understand the structure
2. **Customize** - Change colors, add features, modify layouts
3. **Add backend** - Connect to a real API or database
4. **Deploy** - Share your application with others
5. **Version control** - Initialize git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

## Resources

- **React Documentation:** https://react.dev/
- **Vite Documentation:** https://vite.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **React Router:** https://reactrouter.com/
- **MDN Web Docs:** https://developer.mozilla.org/

## Getting Help

- Check browser console (F12) for error messages
- Read error messages carefully - they often tell you exactly what's wrong
- Search Stack Overflow for specific error messages
- Check the project's README.md for additional information

---

**Congratulations!** 🎉 You've successfully exported and set up your Parent Dashboard locally!
