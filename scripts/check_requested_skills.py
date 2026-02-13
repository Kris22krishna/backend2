import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add the parent directory to sys.path to allow imports from app
# We are in backend2/backend2/scripts/check_requested_skills.py
# We want to add backend2/backend2 to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir) # scripts
grandparent_dir = os.path.dirname(parent_dir) # backend2/backend2 (where app is)
sys.path.append(grandparent_dir)

from app.core.config import settings
from app.modules.skills.models import Skill
from app.modules.questions.models import QuestionGeneration

# List of requested skills
requested_skills = [
    {"skill_id": 960, "topic": "Number theory", "skill_name": "Prime or composite", "template_id": 123},
    {"skill_id": 962, "topic": "Number theory", "skill_name": "Multiplicative inverses", "template_id": 128},
    {"skill_id": 965, "topic": "Number theory", "skill_name": "Lowest common multiple", "template_id": 499},
    {"skill_id": 968, "topic": "Number theory", "skill_name": "Compare numbers written in scientific notation", "template_id": 175},
    {"skill_id": 971, "topic": "Integers", "skill_name": "Integers on number lines", "template_id": 207},
    {"skill_id": 974, "topic": "Integers", "skill_name": "Compare and order integers", "template_id": 220},
    {"skill_id": 977, "topic": "Operations with integers", "skill_name": "Add and subtract integers", "template_id": 249},
    {"skill_id": 983, "topic": "Operations with integers", "skill_name": "Evaluate numerical expressions involving integers", "template_id": 287},
    {"skill_id": 985, "topic": "Decimals", "skill_name": "Compare and order decimals", "template_id": 296},
    {"skill_id": 992, "topic": "Operations with decimals", "skill_name": "Divide decimals", "template_id": 360},
    {"skill_id": 998, "topic": "Operations with decimals", "skill_name": "Evaluate numerical expressions involving decimals", "template_id": 397},
    {"skill_id": 999, "topic": "Fractions and mixed numbers", "skill_name": "Understanding fractions: word problems", "template_id": 439},
    {"skill_id": 1003, "topic": "Fractions and mixed numbers", "skill_name": "Lowest common denominator", "template_id": 504},
    {"skill_id": 1007, "topic": "Fractions and mixed numbers", "skill_name": "Compare mixed numbers and improper fractions", "template_id": 562},
    {"skill_id": 1009, "topic": "Operations with fractions", "skill_name": "Add and subtract fractions", "template_id": 613},
    {"skill_id": 1017, "topic": "Operations with fractions", "skill_name": "Multiply fractions", "template_id": 712},
    {"skill_id": 1021, "topic": "Operations with fractions", "skill_name": "Divide fractions", "template_id": 776},
    {"skill_id": 1028, "topic": "Rational numbers", "skill_name": "Convert between decimals and fractions or mixed numbers", "template_id": 1573},
    {"skill_id": 1033, "topic": "Rational numbers", "skill_name": "Multiply and divide rational numbers", "template_id": 1067},
    {"skill_id": 1036, "topic": "Exponents", "skill_name": "Evaluate powers", "template_id": 1681},
    {"skill_id": 1045, "topic": "Ratios, rates and proportions", "skill_name": "Unit rates", "template_id": 1735},
    {"skill_id": 1048, "topic": "Ratios, rates and proportions", "skill_name": "Do the ratios form a proportion?", "template_id": 1937},
    {"skill_id": 1059, "topic": "Percents", "skill_name": "Percents of numbers and money amounts", "template_id": 2041},
    {"skill_id": 1072, "topic": "Consumer maths", "skill_name": "Simple interest", "template_id": 2335},
    {"skill_id": 1078, "topic": "Problem solving and estimation", "skill_name": "Elapsed time word problems", "template_id": 2451},
]

def check_data():
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    print("Checking Skills and Templates...")
    
    missing_skills = []
    missing_templates = []
    
    for item in requested_skills:
        # Check Skill
        skill = session.query(Skill).filter_by(skill_id=item['skill_id']).first()
        if not skill:
            missing_skills.append(item['skill_id'])
        
        # Check Template
        template = session.query(QuestionGeneration).filter_by(template_id=item['template_id']).first()
        if not template:
            missing_templates.append(item['template_id'])
            
    print(f"Missing Skill IDs: {missing_skills}")
    print(f"Missing Template IDs: {missing_templates}")
    
    session.close()

if __name__ == "__main__":
    check_data()
