import sys
import os
from sqlalchemy import text
sys.path.append(os.getcwd())
from app.db.session import engine

def check_student_grades():
    with open("grades_output.txt", "w") as f:
        f.write("Checking specific student grades...\n")
        with engine.connect() as connection:
            result = connection.execute(text("SELECT grade, created_at FROM students ORDER BY created_at DESC LIMIT 5"))
            for row in result:
                f.write(f"Grade: {row.grade}, Created At: {row.created_at}\n")

if __name__ == "__main__":
    check_student_grades()
