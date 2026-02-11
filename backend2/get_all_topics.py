from app.db.session import SessionLocal
from app.modules.skills.models import Skill

def get_topics():
    db = SessionLocal()
    try:
        with open('topics_check.txt', 'w') as f:
            for g in [3, 4, 5, 6, 7, 8]:
                skills = db.query(Skill).filter(Skill.grade == g).all()
                topics = sorted(list(set(s.topic for s in skills if s.topic)))
                f.write(f"Grade {g} Topics: {topics}\n")
    finally:
        db.close()

if __name__ == "__main__":
    get_topics()
