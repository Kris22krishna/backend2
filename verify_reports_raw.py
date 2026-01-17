import sys
import os
from sqlalchemy import create_engine, text
from app.core.config import settings
from app.db.base import Base

# Add current directory to path
sys.path.append(os.getcwd())

def verify_raw():
    print("Verifying via Raw SQL...", flush=True)
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Check columns in information_schema
            query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'reports'
            """)
            result = conn.execute(query)
            columns = [row[0] for row in result.fetchall()]
            
            print(f"Columns found: {columns}", flush=True)
            
            required = ['report_data', 'user_id', 'created_at']
            missing = [c for c in required if c not in columns]
            
            if missing:
                print(f"FAILED: Missing columns: {missing}", flush=True)
            else:
                print("SUCCESS: All required columns present.", flush=True)

    except Exception as e:
        print(f"Error: {e}", flush=True)

if __name__ == "__main__":
    verify_raw()
