import sys
import os

# Add the current directory to sys.path to make the app module importable
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.modules.auth.models import Credential, User

def list_users():
    db = SessionLocal()
    try:
        creds = db.query(Credential).all()
        for c in creds:
            print(f"Identifier: {c.identifier}, AuthType: {c.auth_type}")
            user = db.query(User).filter(User.user_id == c.user_id).first()
            if user:
                print(f"  UserType: {user.user_type}, Status: {user.status}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
