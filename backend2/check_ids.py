from sqlalchemy import create_engine, text
from app.core.config import settings

def get_skills():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT skill_id, topic, sub_topic, skill_name FROM skills WHERE grade = 5 ORDER BY skill_id"))
        print("SkillID | Topic | Sub-Topic | Name")
        for row in result:
            print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]}")

if __name__ == "__main__":
    get_skills()
