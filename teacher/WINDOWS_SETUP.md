# 🪟 Windows Setup Guide for SKILL100.AI

## For Windows Users - Step by Step

### Prerequisites

#### Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS version** (recommended for most users)
3. Run the installer
4. Keep clicking "Next" with default options
5. Click "Finish"

#### Step 2: Verify Installation

1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. In the black window (Command Prompt), type:
   ```
   node --version
   ```
4. You should see something like `v20.x.x` or `v18.x.x`

### Quick Start Method (Easiest)

1. **Extract the project** to a folder like `C:\Projects\skill100-dashboard`

2. **Double-click** the `start.bat` file

3. **Wait** for installation to complete (first time only, takes 2-5 minutes)

4. **Open browser** to http://localhost:5173

5. **Login** with:
   - Username: `teacher`
   - Password: `password`

### Manual Method (Alternative)

1. **Open Command Prompt in project folder:**
   - Navigate to your project folder in File Explorer
   - Click in the address bar at the top
   - Type `cmd` and press Enter

2. **Install dependencies** (first time only):
   ```
   npm install
   ```
   Wait for this to complete (2-5 minutes)

3. **Start the application:**
   ```
   npm run dev
   ```

4. **Open your browser** to: http://localhost:5173

### Common Windows Issues

#### Issue: "node is not recognized"
**Solution:** Restart your computer after installing Node.js

#### Issue: PowerShell execution policy error
**Solution:** Use Command Prompt (cmd) instead of PowerShell, or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Issue: Port already in use
**Solution:** Close other applications running on port 5173, or Vite will automatically use the next available port

#### Issue: Antivirus blocking installation
**Solution:** Temporarily disable antivirus during `npm install`, then re-enable it

### Folder Structure

After extraction, you should have:
```
C:\Projects\skill100-dashboard\
├── src\
│   ├── app\
│   └── styles\
├── package.json
├── index.html
├── start.bat  ← Double-click this to start!
└── ... other files
```

### Stopping the Server

To stop the development server:
1. Go to the Command Prompt window
2. Press `Ctrl + C`
3. Type `Y` if asked to confirm
4. Press Enter

### Creating a Desktop Shortcut

1. Right-click on `start.bat`
2. Click "Send to" → "Desktop (create shortcut)"
3. Now you can start the app from your desktop!

### Next Steps After Installation

1. ✅ Application runs successfully
2. ✅ Login works  
3. ✅ Explore the Dashboard
4. ✅ Check Students page
5. ✅ Try Assignments page  
6. ✅ Test Attendance tracking
7. ✅ View Settings page

### Building for Production (Advanced)

To create a production build:
```
npm run build
```

The built files will be in the `dist` folder.

To test the production build:
```
npm run preview
```

### Need More Help?

📖 See `LOCAL_SETUP.md` for detailed instructions  
📋 See `EXPORT_CHECKLIST.md` to verify all files are present  
🚀 See `START_HERE.md` for a quick overview

---

**Enjoy your SKILL100.AI Teacher Dashboard! 🎓**
