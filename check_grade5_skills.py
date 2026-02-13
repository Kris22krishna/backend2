from sqlalchemy import create_engine, text
from app.core.config import settings

def check_skills():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT skill_id, skill_name FROM skills WHERE grade = 5 AND topic = 'Ways to Multiply and Divide' ORDER BY skill_id"))
        print("Skills for 'Ways to Multiply and Divide':")
        for row in result:
            print(f"{row[0]}: {row[1]}")

if __name__ == "__main__":
    check_skills()
