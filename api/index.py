# Vercel Entry Point for FastAPI
# This file helps Vercel find the FastAPI app instance

import sys
import os

# Get the directory containing this file (api/)
current_dir = os.path.dirname(os.path.abspath(__file__))

# Go up one level to repo root, then into backend2 directory
repo_root = os.path.dirname(current_dir)
backend_path = os.path.join(repo_root, 'backend2')

# Add backend2 to Python path
sys.path.insert(0, backend_path)

# Now import the FastAPI app from app.main
from app.main import app

# Export the app for Vercel
__all__ = ['app']
