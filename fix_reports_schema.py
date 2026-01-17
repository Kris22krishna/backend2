import sys
import os
from sqlalchemy import create_engine, text
from app.core.config import settings
from app.db.base import Base
from app.modules.student.models import Report
from app.modules.auth.models import User # Required for FK resolution

# Add current directory to path
sys.path.append(os.getcwd())

def reset_reports_table():
    print("Resetting 'reports' table...", flush=True)
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        # Drop table
        with engine.connect() as conn:
            print("Dropping 'reports' table...", flush=True)
            conn.execute(text("DROP TABLE IF EXISTS reports CASCADE"))
            conn.commit()
            
        # Create table
        print("Creating 'reports' table...", flush=True)
        # We prefer to use Base.metadata.create_all for the specific table if possible,
        # or we can bind the specific table.
        Report.__table__.create(bind=engine)
        print("Table 'reports' created successfully.", flush=True)
        
    except Exception as e:
        print(f"Error: {e}", flush=True)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    reset_reports_table()
