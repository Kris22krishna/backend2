from app.db.session import SessionLocal
from app.modules.practice.models import QuestionAttempt
from sqlalchemy import func, cast, Date, Integer

try:
    db = SessionLocal()
    print("DB Connection Successful")
    
    # Test the query structure
    query = db.query(
        cast(QuestionAttempt.attempted_at, Date).label('date'),
        func.sum(QuestionAttempt.time_spent_seconds).label('total_time'),
        func.sum(cast(QuestionAttempt.is_correct, Integer)).label('total_solved')
    ).group_by(
        cast(QuestionAttempt.attempted_at, Date)
    )
    
    print("Query construction successful")
    print(str(query))
    
    results = query.all()
    print(f"Query execution successful. Rows: {len(results)}")

except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
