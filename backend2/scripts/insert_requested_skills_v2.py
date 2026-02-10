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

def insert_skills():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    new_skills_data = [
        # Class 10th
        {"grade": 10, "topic": "Pair of Linear Equations in Two Variables", "skill_name": "Graphical Method of Solution of a Pair of Linear Equations"},
        {"grade": 10, "topic": "Pair of Linear Equations in Two Variables", "skill_name": "Algebraic Methods of Solving a Pair of Linear Equations"},
        {"grade": 10, "topic": "Pair of Linear Equations in Two Variables", "skill_name": "Substitution Method"},
        {"grade": 10, "topic": "Pair of Linear Equations in Two Variables", "skill_name": "Elimination Method"},
        
        # Grade 9 (Already handled but keeping for complete record/check)
        {"grade": 9, "topic": "Linear Equation in Two Variables", "skill_name": "Linear equation"},
        {"grade": 9, "topic": "Linear Equation in Two Variables", "skill_name": "Solution of a linear equation"},

        # Grade 8 (Already handled but keeping for complete record/check)
        {"grade": 8, "topic": "Exponents and Power", "skill_name": "Powers with Negative Exponents"},
        {"grade": 8, "topic": "Exponents and Power", "skill_name": "Laws of Exponents"},
        {"grade": 8, "topic": "Exponents and Power", "skill_name": "Use of Exponents to Express Small Numbers in Standard Form"},
        {"grade": 8, "topic": "Exponents and Power", "skill_name": "Comparing very large and very small Numbers"},
        
        # Grade 7
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "exponents"},
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "laws of exponents - multiplying powers with the same base"},
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "laws of exponents - dividing powers with the same base"},
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "laws of exponents - taking power of a power"},
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "laws of exponents - multiplying powers of the same exponents"},
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "laws of exponents - dividing powers of the same exponents"},
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "miscellaneous examples using the laws of exponents"},
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "decimal number system"},
        {"grade": 7, "topic": "Exponents and Powers", "skill_name": "expressing large numbers in the standard form"},

        # 6th Grade
        {"grade": 6, "topic": "FRACTION", "skill_name": "Fractional units and equals shares"},
        {"grade": 6, "topic": "FRACTION", "skill_name": "Fractional units as parts of a whole"},
        {"grade": 6, "topic": "FRACTION", "skill_name": "Measuring using Fractional units"},
        {"grade": 6, "topic": "FRACTION", "skill_name": "Marking fraction length on the number line(image)"},
        {"grade": 6, "topic": "FRACTION", "skill_name": "mixed fractions"},
        {"grade": 6, "topic": "FRACTION", "skill_name": "Equivalent Fractions"},
        {"grade": 6, "topic": "FRACTION", "skill_name": "Comparing Fraction"},
        {"grade": 6, "topic": "FRACTION", "skill_name": "Addition and Subtraction of fraction"},
        {"grade": 6, "topic": "FRACTION", "skill_name": "Pinch of history"},

        # Class 5th
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Maniratnam-The Cashier( Multiplication of 2 digit numbers with each other)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Shantaram a Special Cook( Multiplication of 3 digit numbers with each other)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Years and Years(Multiplication word problems)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Karunya the Landlord( Area and Perimeter)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Farmers in Vidarbha( Multiplication word problems)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Fun with multiplication( Follow a pattern)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "How many times?(Dividing 3 digit using 2 digit- story based)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "How much petrol?(Division word problems)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Children’s Day(Division word problems)"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Make the best story problem"},
        {"grade": 5, "topic": "Ways to Multiply and Divide", "skill_name": "Cross Check for Harisharan(Multiple step division and multiplication word problems)"},
    ]
    
    try:
        print("Inserting skills...")
        for skill_info in new_skills_data:
            existing = db.query(Skill).filter(
                Skill.grade == skill_info["grade"],
                Skill.topic == skill_info["topic"],
                Skill.skill_name == skill_info["skill_name"]
            ).first()
            
            if not existing:
                skill = Skill(**skill_info)
                db.add(skill)
                print(f"Added: {skill_info['skill_name']} (Grade {skill_info['grade']})")
            else:
                print(f"Skipped (exists): {skill_info['skill_name']} (Grade {skill_info['grade']})")
                
        db.commit()
        print("\nAll skills processed successfully.")
            
    except Exception as e:
        print(f"Error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_skills()
