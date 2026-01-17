import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

print("Attempting to import app.main...")
try:
    from app.main import app
    print("Successfully imported app.main:app")
except Exception as e:
    print(f"Failed to import app.main: {e}")
    import traceback
    traceback.print_exc()
