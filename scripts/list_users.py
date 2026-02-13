
from app.db.session import SessionLocal
from app.modules.auth.models import User

db = SessionLocal()
try:
    users = db.query(User).all()
    print("Available Users:")
    for u in users:
        print(f"Username: {u.username}, ID: {u.user_id}, Email: {u.email}")
except Exception as e:
    print(f"Error listing users: {e}")
finally:
    db.close()
