import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the project root to sys.path to allow imports from app
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from app.modules.skills.models import Skill
from app.core.config import settings

def delete_skills():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    # IDs to delete:
    # 1905: Make the best story problem
    # 1907-1917: Class 5 Parts and wholes
    ids_to_delete = [1905] + list(range(1907, 1918))
    
    try:
        print(f"Attempting to delete skills with IDs: {ids_to_delete}")
        deleted_count = db.query(Skill).filter(Skill.skill_id.in_(ids_to_delete)).delete(synchronize_session=False)
        db.commit()
        print(f"Successfully deleted {deleted_count} skills.")
    except Exception as e:
        print(f"Error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    delete_skills()
