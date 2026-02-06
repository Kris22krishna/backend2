@echo off
echo ========================================
echo  SKILL100.AI Teacher Dashboard
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This will take a few minutes on first run.
    echo.
    call npm install
    echo.
)

echo Starting development server...
echo.
echo The application will open at: http://localhost:5173
echo.
echo Login credentials:
echo   Username: teacher
echo   Password: password
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
