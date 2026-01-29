
from sqlalchemy import create_engine, text
from app.core.config import settings

def check_skills():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        try:
            result = conn.execute(text("SELECT grade, COUNT(*) FROM skills GROUP BY grade ORDER BY grade"))
            print("Skills count by grade:")
            rows = list(result)
            if not rows:
                print("No skills found in the database.")
            for row in rows:
                print(f"Grade {row[0]}: {row[1]} skills")
        except Exception as e:
            print(f"Error querying skills table: {e}")
            # Check if table exists
            try:
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='skills'"))
                if not result.first():
                    print("Table 'skills' does not exist.")
            except:
                pass

if __name__ == "__main__":
    check_skills()
