
from app.db.session import SessionLocal
from app.modules.auth.models import User

db = SessionLocal()
try:
    u = db.query(User).first()
    if u:
        for k, v in u.__dict__.items():
            if not k.startswith('_'):
                print(f"{k}: {v}")
    else:
        print("No users found.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
