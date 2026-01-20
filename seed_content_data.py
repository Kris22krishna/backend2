"""
Seed script to populate sample content data.
Creates sample grades, categories, and skills matching the frontend mock data.
"""

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.content.models import Grade, Category, Skill


def seed_content_data():
    """Seed sample content data"""
    db: Session = SessionLocal()
    
    try:
        # Check if data already exists
        existing_grade = db.query(Grade).first()
        if existing_grade:
            print("⚠ Content data already exists. Skipping seed.")
            return
        
        # Create Grade 1
        grade1 = Grade(id=1, name="Class 1", display_order=0)
        db.add(grade1)
        db.flush()
        
        # Category A: Numbers and comparing
        cat_a = Category(
            id=1,
            grade_id=grade1.id,
            parent_id=None,
            code="A",
            name="Numbers and comparing",
            display_order=0
        )
        db.add(cat_a)
        db.flush()
        
        # Category A.1: Even and odd (child of A)
        cat_a1 = Category(
            id=2,
            grade_id=grade1.id,
            parent_id=cat_a.id,
            code=None,
            name="Even and odd",
            display_order=0
        )
        db.add(cat_a1)
        db.flush()
        
        # Skills under Even and odd
        skill_a1 = Skill(
            id=101,
            category_id=cat_a1.id,
            code="A.1",
            title="Even or odd",
            display_order=0
        )
        skill_a2 = Skill(
            id=102,
            category_id=cat_a1.id,
            code="A.2",
            title="Even or odd: arithmetic rules",
            display_order=1
        )
        db.add_all([skill_a1, skill_a2])
        
        # Category A.2: Sequences (child of A)
        cat_a2 = Category(
            id=3,
            grade_id=grade1.id,
            parent_id=cat_a.id,
            code=None,
            name="Sequences",
            display_order=1
        )
        db.add(cat_a2)
        db.flush()
        
        # Skill directly under Sequences
        skill_a3 = Skill(
            id=103,
            category_id=cat_a2.id,
            code="A.3",
            title="Skip-counting puzzles",
            display_order=0
        )
        db.add(skill_a3)
        
        # Category A.2.1: Skip counting (child of Sequences)
        cat_a2_1 = Category(
            id=4,
            grade_id=grade1.id,
            parent_id=cat_a2.id,
            code=None,
            name="Skip counting",
            display_order=0
        )
        db.add(cat_a2_1)
        db.flush()
        
        # Skills under Skip counting
        skill_a3_dup = Skill(
            id=104,
            category_id=cat_a2_1.id,
            code="A.3",
            title="Skip-counting puzzles",
            display_order=0
        )
        skill_a4 = Skill(
            id=105,
            category_id=cat_a2_1.id,
            code="A.4",
            title="Number sequences",
            display_order=1
        )
        db.add_all([skill_a3_dup, skill_a4])
        
        # Skill directly under category A
        skill_a5 = Skill(
            id=106,
            category_id=cat_a.id,
            code="A.5",
            title="Comparing numbers",
            display_order=0
        )
        db.add(skill_a5)
        
        # Category B: Place values
        cat_b = Category(
            id=5,
            grade_id=grade1.id,
            parent_id=None,
            code="B",
            name="Place values",
            display_order=1
        )
        db.add(cat_b)
        db.flush()
        
        # Category B.1: Nested Concept B.2 (child of B)
        cat_b1 = Category(
            id=50,
            grade_id=grade1.id,
            parent_id=cat_b.id,
            code=None,
            name="Nested Concept B.2",
            display_order=0
        )
        db.add(cat_b1)
        db.flush()
        
        # Skills under Nested Concept B.2
        skill_b21 = Skill(
            id=250,
            category_id=cat_b1.id,
            code="B.2.1",
            title="Sub-skill of B.2",
            display_order=0
        )
        skill_b22 = Skill(
            id=251,
            category_id=cat_b1.id,
            code="B.2.2",
            title="Another sub-skill",
            display_order=1
        )
        db.add_all([skill_b21, skill_b22])
        
        # Skills directly under category B
        skill_b1 = Skill(
            id=201,
            category_id=cat_b.id,
            code="B.1",
            title="Place value models up to hundreds",
            display_order=0
        )
        skill_b3 = Skill(
            id=203,
            category_id=cat_b.id,
            code="B.3",
            title="Value of a digit",
            display_order=1
        )
        db.add_all([skill_b1, skill_b3])
        
        # Category C: Addition
        cat_c = Category(
            id=6,
            grade_id=grade1.id,
            parent_id=None,
            code="C",
            name="Addition",
            display_order=2
        )
        db.add(cat_c)
        db.flush()
        
        # Skills under Addition
        skill_c1 = Skill(
            id=301,
            category_id=cat_c.id,
            code="C.1",
            title="Add two numbers up to three digits",
            display_order=0
        )
        skill_c2 = Skill(
            id=302,
            category_id=cat_c.id,
            code="C.2",
            title="Addition input/output tables",
            display_order=1
        )
        skill_c3 = Skill(
            id=303,
            category_id=cat_c.id,
            code="C.3",
            title="Complete the addition sentence",
            display_order=2
        )
        db.add_all([skill_c1, skill_c2, skill_c3])
        
        # Commit all changes
        db.commit()
        
        print("✓ Sample content data seeded successfully!")
        print("  - Created Grade 1 (Class 1)")
        print("  - Created 7 categories with nested structure")
        print("  - Created 15 skills across various categories")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Error seeding data: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_content_data()
