from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_and_update():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        print("Adding 'sub_topic' column to 'skills' table...")
        try:
            conn.execute(text("ALTER TABLE skills ADD COLUMN sub_topic TEXT"))
            conn.commit()
            print("Column added successfully.")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("Column 'sub_topic' already exists.")
            else:
                print(f"Error adding column: {e}")
                return

        print("Updating Grade 5 'Ways to Multiply and Divide' skills...")
        
        # Mapping of skill IDs to sub-topics based on user reference
        updates = [
            # Multiplication
            ("Multiplication", [1896, 1897, 1898, 1899]),
            # Division
            ("Division", [1901, 1902, 1903]),
            # Skill Application Problems
            ("Skill Application Problems", [1900, 1904, 1905, 1906])
        ]

        total_updated = 0
        for sub_topic, skill_ids in updates:
            result = conn.execute(
                text("UPDATE skills SET sub_topic = :sub WHERE skill_id IN :ids"),
                {"sub": sub_topic, "ids": tuple(skill_ids)}
            )
            total_updated += result.rowcount
        
        conn.commit()
        print(f"Successfully updated {total_updated} skills with sub-topics.")

if __name__ == "__main__":
    migrate_and_update()
