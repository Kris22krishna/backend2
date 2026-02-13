from fastapi import APIRouter, Depends, Query
from app.modules.puzzles.schemas import PuzzleResponse
import uuid

router = APIRouter(prefix="/puzzles", tags=["puzzles"])

@router.get("/daily", response_model=PuzzleResponse)
def get_daily_puzzle(
    grade: int = Query(..., description="Grade level for the puzzle"),
    uid: str = Query(..., description="User ID requesting the puzzle")
):
    """
    Get the daily puzzle for a specific grade.
    For now, returns a static puzzle based on grade.
    """
    # In a real app, this would query a DB based on date and grade.
    
    if grade <= 5:
        return {
            "puzzle_id": str(uuid.uuid4()),
            "title": "Daily Math Logic",
            "description": "Solve this logic puzzle.",
            "question": "If you have 3 apples and take away 2, how many do you have?",
            "options": ["1", "2", "3", "0"],
            "correct_answer": "2",
            "grade": grade,
            "difficulty": "Easy"
        }
    else:
        return {
            "puzzle_id": str(uuid.uuid4()),
            "title": "Daily Algebra Challenge",
            "description": "Solve for X.",
            "question": "2x + 5 = 15. What is x?",
            "options": ["5", "10", "2.5", "7"],
            "correct_answer": "5",
            "grade": grade,
            "difficulty": "Medium"
        }
