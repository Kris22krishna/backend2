from pydantic import BaseModel
from typing import Optional, List

class PuzzleResponse(BaseModel):
    puzzle_id: str
    title: str
    description: str
    question: str
    options: List[str]
    correct_answer: str
    grade: int
    difficulty: str
