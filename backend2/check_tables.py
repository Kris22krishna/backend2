from app.db.session import engine
from sqlalchemy import inspect

def check_tables():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables: {tables}")
    if "assessment_students" in tables:
        print("✅ assessment_students table exists.")
    else:
        print("❌ assessment_students table MISSING.")

if __name__ == "__main__":
    check_tables()
