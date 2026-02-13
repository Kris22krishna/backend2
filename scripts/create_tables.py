"""
Script to create the skills and question_generation tables in the database.
Run this script to set up the new tables for the updated template design.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def create_tables():
    engine = create_engine(settings.DATABASE_URL)
    
    # Create skills table
    skills_table_sql = """
    CREATE TABLE IF NOT EXISTS skills (
        skill_id SERIAL PRIMARY KEY,
        grade INT NOT NULL,
        topic TEXT NOT NULL,
        skill_name TEXT NOT NULL
    );
    """
    
    # Create question_generation table  
    question_generation_sql = """
    CREATE TABLE IF NOT EXISTS question_generation (
        template_id SERIAL PRIMARY KEY,
        skill_id INT NOT NULL,
        grade INT NOT NULL,
        category TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        type TEXT NOT NULL,
        format INT NOT NULL,
        difficulty TEXT NOT NULL,
        question_template TEXT NOT NULL,
        answer_template TEXT NOT NULL,
        solution_template TEXT NOT NULL
    );
    """
    
    with engine.connect() as conn:
        print("Creating skills table...")
        conn.execute(text(skills_table_sql))
        print("Skills table created successfully!")
        
        print("Creating question_generation table...")
        conn.execute(text(question_generation_sql))
        print("Question_generation table created successfully!")
        
        conn.commit()
        print("\nAll tables created successfully!")

if __name__ == "__main__":
    create_tables()
