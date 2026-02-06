# SKILL100.AI - Local Setup Guide

This guide will help you set up and run the SKILL100.AI Teacher Dashboard application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your computer:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **pnpm** (recommended)

To check if you have Node.js installed, run:
```bash
node --version
npm --version
```

## Installation Steps

### 1. Extract the Project

Extract all the project files to a folder on your computer (e.g., `C:\Projects\skill100-dashboard` or `~/Projects/skill100-dashboard`)

### 2. Install pnpm (Recommended)

This project is optimized for pnpm. Install it globally:

```bash
npm install -g pnpm
```

Alternatively, you can use npm instead (see Option B below).

### 3. Install Dependencies

Open a terminal/command prompt in the project folder and run:

**Option A: Using pnpm (Recommended)**
```bash
pnpm install
```

**Option B: Using npm**
```bash
npm install
```

This will install all required packages (React, Tailwind CSS, Material-UI, charts, etc.). This may take a few minutes.

### 4. Run the Development Server

Start the application:

**Using pnpm:**
```bash
pnpm dev
```

**Using npm:**
```bash
npm run dev
```

You should see output similar to:
```
VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5. Open in Browser

Open your web browser and navigate to:
```
http://localhost:5173
```

You should see the SKILL100.AI login page!

## Default Login Credentials

Use these credentials to log in:
- **Username:** `teacher`
- **Password:** `password`

Or:
- **Username:** `admin`
- **Password:** `admin123`

## Available Scripts

- **`pnpm dev`** or **`npm run dev`** - Start development server
- **`pnpm build`** or **`npm run build`** - Build for production
- **`pnpm preview`** or **`npm run preview`** - Preview production build locally

## Building for Production

To create a production-ready build:

```bash
pnpm build
```

The built files will be in the `dist` folder. You can deploy these files to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

To preview the production build locally:

```bash
pnpm preview
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.). Check the terminal output for the actual URL.

### Module Not Found Errors

If you see "module not found" errors, try:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
pnpm install
```

### TypeScript Errors

If you see TypeScript errors, ensure you're using Node.js 18 or higher:

```bash
node --version
```

### Clear Cache

If you encounter strange errors, try clearing the cache:

```bash
# Delete cache folders
rm -rf node_modules .vite dist

# Reinstall
pnpm install
```

## Project Structure

```
skill100-dashboard/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Main app component with routing
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   └── routes.ts            # Route definitions
│   ├── styles/                  # CSS and styling
│   └── main.tsx                 # Application entry point
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
└── postcss.config.mjs          # PostCSS configuration
```

## Features

✅ **Dashboard** - Overview statistics, today's schedule, teaching insights
✅ **Students** - Comprehensive student management and performance tracking
✅ **Assignments** - Math assignment analytics with Excel export
✅ **Attendance** - Real-time attendance tracking with analytics
✅ **Settings** - Profile and school configuration
✅ **Interactive Charts** - Click-based modals for detailed student data
✅ **Math Topics** - Specialized tracking for 9 math subjects
✅ **Responsive Design** - Works on desktop and tablet devices

## Technology Stack

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool and dev server
- **Tailwind CSS 4.1** - Styling
- **Material-UI** - UI components
- **Recharts** - Data visualization
- **React Router 7** - Navigation
- **Lucide React** - Icons

## Support

For issues or questions about the application:
1. Check the troubleshooting section above
2. Review the code comments in the source files
3. Check the browser console for error messages

## Next Steps

After running the application locally, you can:

1. **Customize the data** - Edit the mock data in component files
2. **Modify styling** - Update colors in `/src/styles/theme.css`
3. **Add features** - Extend functionality in the `/src/app` directory
4. **Deploy online** - Build and deploy to hosting services

---

**Congratulations!** 🎉 Your SKILL100.AI Teacher Dashboard is now running locally.
