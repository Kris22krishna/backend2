
import sys
import os
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.modules.auth.models import Credential, User

def get_first_uploader_id():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.user_type == 'uploader', User.status == 'active').first()
        if user:
            print(f"USER_ID:{user.user_id}")
        else:
            # Fallback to admin
            user = db.query(User).filter(User.user_type == 'admin').first()
            if user:
                print(f"USER_ID:{user.user_id}")
            else:
                 print("No suitable user found")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    get_first_uploader_id()
