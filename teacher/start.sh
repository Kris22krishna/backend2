#!/bin/bash

echo "========================================"
echo " SKILL100.AI Teacher Dashboard"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    echo "This will take a few minutes on first run."
    echo ""
    npm install
    echo ""
fi

echo "Starting development server..."
echo ""
echo "The application will open at: http://localhost:5173"
echo ""
echo "Login credentials:"
echo "  Username: teacher"
echo "  Password: password"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm run dev
