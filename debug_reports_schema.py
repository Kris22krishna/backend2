import sys
import os
from sqlalchemy import text, inspect

# Add current directory to path
sys.path.append(os.getcwd())

from app.db.session import engine

def inspect_reports_table():
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns("reports")]
    print(f"Columns in 'reports': {columns}")

if __name__ == "__main__":
    inspect_reports_table()
