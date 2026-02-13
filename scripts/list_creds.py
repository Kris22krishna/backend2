
from app.db.session import SessionLocal
from app.modules.auth.models import Credential

db = SessionLocal()
try:
    creds = db.query(Credential).all()
    print("Available Credentials:")
    for c in creds:
        print(f"User: {c.identifier} | ID: {str(c.user_id)}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
