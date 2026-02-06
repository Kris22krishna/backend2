# Parent Dashboard - Educational Platform

A comprehensive educational platform Parent Dashboard for monitoring children's learning performance, quiz completion, skill mastery, and progress tracking.

## Features

- **Dashboard Overview**: View child's learning statistics, recent activity, and quick insights
- **Quizzes**: Track quiz attempts, scores, and performance trends
- **Skills**: Monitor mastered skills and areas for growth
- **Progress**: Visualize learning consistency and improvement over time
- **Reports**: Generate comprehensive monthly performance reports

## Design System

The dashboard uses a calm, reassuring color palette:
- Mint: `#A8FBD3`
- Teal: `#4FB7B3`
- Purple: `#637AB9`
- Deep Purple: `#31326F`

Features a cute fox mascot throughout the interface to create an engaging, friendly experience.

## Tech Stack

- **React** 18.3.1
- **TypeScript**
- **Vite** - Build tool and development server
- **Tailwind CSS** v4 - Styling
- **React Router** v7 - Navigation
- **Recharts** - Data visualization
- **Radix UI** - Accessible component primitives
- **Material UI** - Additional UI components
- **Lucide React** - Icons

## Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **pnpm** package manager (comes with Node.js)

To check if you have Node.js installed, run:
```bash
node --version
npm --version
```

## Getting Started

### 1. Download/Export the Project

Download all project files from Figma Make and save them to a folder on your computer. The folder structure should look like this:

```
parent-dashboard/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── styles/
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── postcss.config.mjs
└── README.md
```

### 2. Install Dependencies

Open your terminal/command prompt, navigate to the project folder, and install dependencies:

```bash
# Navigate to your project folder
cd path/to/parent-dashboard

# Install dependencies using npm
npm install

# OR using pnpm (faster alternative)
pnpm install
```

This will install all required packages listed in `package.json`.

### 3. Run the Development Server

Start the development server:

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

The application will start running at `http://localhost:5173` (or another port if 5173 is busy).

Open your browser and navigate to the URL shown in the terminal.

### 4. Build for Production

To create a production-ready build:

```bash
# Using npm
npm run build

# OR using pnpm
pnpm run build
```

This creates an optimized build in the `dist/` folder.

### 5. Preview Production Build

To preview the production build locally:

```bash
# Using npm
npm run preview

# OR using pnpm
pnpm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI component library
│   │   ├── DashboardLayout.tsx
│   │   └── figma/          # Figma-specific components
│   ├── pages/              # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── QuizzesPage.tsx
│   │   ├── SkillsPage.tsx
│   │   ├── ProgressPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── NotificationsPage.tsx
│   ├── App.tsx             # Main application component
│   └── routes.tsx          # Route definitions
├── styles/
│   ├── index.css           # Global styles
│   ├── tailwind.css        # Tailwind imports
│   ├── theme.css           # Theme tokens
│   └── fonts.css           # Font imports
└── main.tsx                # Application entry point
```

## Browser Support

Modern browsers including:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### Port Already in Use

If you get an error that port 5173 is already in use, Vite will automatically try the next available port. Check your terminal for the actual URL.

### Installation Errors

If you encounter errors during `npm install`:
1. Delete the `node_modules` folder and `package-lock.json` file
2. Run `npm install` again
3. Alternatively, try using `pnpm` instead of `npm`

### Module Not Found Errors

Make sure all dependencies are installed by running:
```bash
npm install
```

### Clear Cache

If you're experiencing issues, try clearing the Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Customization

### Changing Colors

Edit the color values in `/src/styles/theme.css` to customize the color palette.

### Adding New Pages

1. Create a new page component in `/src/app/pages/`
2. Add the route in `/src/app/routes.tsx`
3. Add navigation link in `/src/app/components/DashboardLayout.tsx`

### Mock Data

Currently, the application uses mock/dummy data for demonstration. To connect to a real backend:
1. Replace the mock data arrays in each page component
2. Add API calls to fetch real data
3. Consider using a state management library (Redux, Zustand) for larger applications

## Future Enhancements

- Backend integration for real data persistence
- User authentication and authorization
- Real-time updates and notifications
- Export reports to PDF
- Email sharing functionality
- Mobile app version

## License

Private - Educational Platform Project

## Support

For questions or issues, please refer to the Figma Make documentation or contact support.
