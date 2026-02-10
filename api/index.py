# Vercel Entry Point for FastAPI
# This file helps Vercel find the FastAPI app instance

import sys
import os

# Add backend2 directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend2'))

# Import the FastAPI app
from app.main import app

# Export the app for Vercel
__all__ = ['app']
