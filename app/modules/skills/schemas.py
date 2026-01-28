from pydantic import BaseModel
from typing import Optional


class SkillCreate(BaseModel):
    """Schema for creating a new skill"""
    grade: int
    topic: str
    skill_name: str


class SkillUpdate(BaseModel):
    """Schema for updating a skill"""
    grade: Optional[int] = None
    topic: Optional[str] = None
    skill_name: Optional[str] = None


class SkillResponse(BaseModel):
    """Schema for skill response"""
    skill_id: int
    grade: int
    topic: str
    skill_name: str
    
    class Config:
        from_attributes = True
