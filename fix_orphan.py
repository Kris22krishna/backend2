import sys
import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.auth.models import Credential
from sqlalchemy import text

# Add current directory to path
sys.path.append(os.getcwd())

def fix_orphaned_credential():
    target_id = "8ce8430e-21d3-4185-8cff-3f7d2a367549"
    
    db = SessionLocal()
    try:
        print(f"checking credential for {target_id}...", flush=True)
        # We search by user_id
        creds = db.query(Credential).filter(Credential.user_id == target_id).all()
        print(f"Found {len(creds)} orphaned credentials.", flush=True)
        
        for c in creds:
            print(f"Deleting credential {c.credential_id} (Identifier: {c.identifier})", flush=True)
            db.delete(c)
        
        db.commit()
        print("Successfully deleted orphaned credentials.", flush=True)
        
    except Exception as e:
        print(f"Error: {e}", flush=True)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_orphaned_credential()
