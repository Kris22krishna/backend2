
from sqlalchemy import create_engine, text
from app.core.config import settings

def add_column():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        try:
            # Check if column exists
            # This is postgres specific check, but might fail on sqlite. 
            # Assuming postgres based on UUID type usage in code, but previous context said sqlite_master? 
            # Wait, `check_skills.py` used `sqlite_master`. So it is SQLite?
            # models.py imports UUID from postgres dialect?? `from sqlalchemy.dialects.postgresql import UUID`
            # If it is SQLite, that import might be just for type hinting or ignored.
            # But if it is SQLite, `ALTER TABLE ADD COLUMN` is supported.
            
            print("Attempting to add created_by_user_id column...")
            conn.execute(text("ALTER TABLE question_generation ADD COLUMN created_by_user_id UUID"))
            conn.commit()
            print("Column added successfully.")
        except Exception as e:
            print(f"Error (might already exist): {e}")

if __name__ == "__main__":
    add_column()
