# SKILL100.AI - Teacher Dashboard Application

A comprehensive teacher dashboard application for managing students, assignments, attendance, and performance analytics.

## 🚀 Quick Start

**New to this project? Start here:**

- 📖 **Windows Users:** See [WINDOWS_SETUP.md](WINDOWS_SETUP.md)
- 📖 **Mac/Linux Users:** See [MAC_LINUX_SETUP.md](MAC_LINUX_SETUP.md)
- 📖 **Quick 3-Step Guide:** See [START_HERE.md](START_HERE.md)

**Or use the quick start script:**
- Windows: Double-click `start.bat`
- Mac/Linux: Run `./start.sh` in Terminal

## ✨ Features

- **Dashboard**: Overview statistics, grade navigation, today's schedule, teaching insights, class activity, and student performance analytics
- **Students**: Detailed student performance survey table with grade navigation and Excel download functionality
- **Assignments**: Math assignment analytics with completion stats, topic focus areas, and interactive charts
- **Attendance**: Comprehensive attendance tracking with Excel export capabilities
- **Settings**: Teacher profile, notification preferences, class management, and school details

## Technology Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI
- **Charts**: Recharts 2.15.2
- **Routing**: React Router 7.13.0
- **Icons**: Lucide React
- **Excel Export**: XLSX 0.18.5

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher (Recommended: 18.x or 20.x)
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **pnpm** (Optional but recommended): Version 8.0.0 or higher

To check your versions:

```bash
node --version
npm --version
pnpm --version  # if using pnpm
```

## Installation

### 1. Download the Project

Download and extract the project files to your local machine, or clone the repository if available:

```bash
# If using git
git clone <repository-url>
cd teacher-dashboard
```

### 2. Install Dependencies

You can use either npm or pnpm to install dependencies:

#### Using npm:

```bash
npm install
```

#### Using pnpm (recommended):

```bash
pnpm install
```

**Note**: The project uses pnpm overrides for specific package versions. If you encounter any issues, try using pnpm instead of npm.

## Running the Project

### Development Mode

To run the project in development mode with hot-reload:

#### Using npm:

```bash
npm run dev
```

#### Using pnpm:

```bash
pnpm dev
```

The application will start and be available at: **http://localhost:5173**

### Production Build

To build the project for production:

#### Using npm:

```bash
npm run build
```

#### Using pnpm:

```bash
pnpm build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

#### Using npm:

```bash
npm run preview
```

#### Using pnpm:

```bash
pnpm preview
```

## Project Structure

```
teacher-dashboard/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable React components
│   │   │   ├── ui/              # UI component library (buttons, cards, etc.)
│   │   │   ├── Header.tsx       # Header component
│   │   │   ├── Sidebar.tsx      # Sidebar navigation
│   │   │   ├── StudentPerformance.tsx
│   │   │   ├── StudentSurvey.tsx
│   │   │   ├── TopPerformers.tsx
│   │   │   └── AtRiskStudents.tsx
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.tsx    # Main dashboard page
│   │   │   ├── Students.tsx     # Students management page
│   │   │   ├── Assignments.tsx  # Assignments tracking page
│   │   │   ├── Attendance.tsx   # Attendance tracking page
│   │   │   ├── Settings.tsx     # Settings page
│   │   │   └── Login.tsx        # Login page
│   │   ├── App.tsx              # Main application component
│   │   └── routes.ts            # Route definitions
│   ├── styles/                  # Stylesheets
│   │   ├── index.css            # Main styles
│   │   ├── tailwind.css         # Tailwind imports
│   │   ├── theme.css            # Theme tokens
│   │   └── fonts.css            # Font imports
│   └── main.tsx                 # Application entry point
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── postcss.config.mjs           # PostCSS configuration
└── README.md                    # This file
```

## Default Login Credentials

The application has a mock authentication system. Use these credentials to log in:

- **Email**: `teacher@school.com` or `admin@school.com`
- **Password**: `password` or `admin123`

**Note**: This is a demo application with mock authentication. In production, implement proper authentication and security measures.

## Environment Variables

This project does not require any environment variables for basic functionality. All data is currently mocked for demonstration purposes.

If you plan to integrate with a real backend:

1. Create a `.env` file in the root directory
2. Add your environment variables:

```env
VITE_API_URL=your_api_url_here
VITE_API_KEY=your_api_key_here
```

3. Access them in your code using `import.meta.env.VITE_API_URL`

## Browser Support

The application is compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. You can also specify a custom port:

```bash
npm run dev -- --port 3000
```

### Module Not Found Errors

If you encounter module not found errors:

1. Delete `node_modules` folder and `package-lock.json` (or `pnpm-lock.yaml`)
2. Clear npm cache: `npm cache clean --force`
3. Reinstall dependencies: `npm install`

### Build Errors

If you encounter build errors:

1. Ensure you're using Node.js version 18 or higher
2. Try using pnpm instead of npm: `pnpm install && pnpm build`
3. Check for any TypeScript errors in the console

### Styling Issues

If Tailwind styles are not applying:

1. Ensure PostCSS is properly configured
2. Restart the development server
3. Clear browser cache

## Features Overview

### Dashboard
- Overview statistics (Total Students, Active Courses, Pending Assignments, Avg Engagement)
- Grade navigation (Grades 6-10)
- Today's schedule
- Teaching insights (completed assignments)
- Class activity with top engaged students
- Mathematics performance with topic-wise breakdown
- Interactive topic dropdown filter
- Top performers and at-risk students

### Students Page
- Comprehensive student performance table
- Grade-wise filtering
- Excel export functionality
- Performance metrics and trends

### Assignments Page
- Assignment completion tracking
- Interactive pie chart with click-to-view student details
- Score distribution with click-to-view student lists
- Topic-wise performance breakdown
- Focus areas identification

### Attendance Page
- Daily attendance tracking
- Monthly statistics
- Attendance trends
- Excel export functionality

### Settings Page
- Teacher profile management
- Notification preferences
- Class management
- School details configuration

## Contributing

This is a demonstration project. For production use, consider:

1. Implementing real authentication and authorization
2. Integrating with a backend API
3. Adding data validation and error handling
4. Implementing proper state management (Redux, Zustand, etc.)
5. Adding unit and integration tests
6. Implementing proper security measures

## License

This project is for demonstration purposes.

## Support

For issues or questions, please refer to the project documentation or contact the development team.

---

**Last Updated**: February 4, 2026