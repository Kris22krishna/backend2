from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from .models import Skill
from .schemas import SkillCreate, SkillUpdate, SkillResponse

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("/", response_model=List[SkillResponse])
def get_all_skills(
    grade: int = None,
    db: Session = Depends(get_db)
):
    """Get all skills, optionally filtered by grade"""
    query = db.query(Skill)
    if grade:
        query = query.filter(Skill.grade == grade)
    return query.all()


@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill_by_id(skill_id: int, db: Session = Depends(get_db)):
    """Get a specific skill by its ID"""
    skill = db.query(Skill).filter(Skill.skill_id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@router.post("/", response_model=SkillResponse, status_code=201)
def create_skill(skill_data: SkillCreate, db: Session = Depends(get_db)):
    """Create a new skill"""
    skill = Skill(**skill_data.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, skill_data: SkillUpdate, db: Session = Depends(get_db)):
    """Update an existing skill"""
    skill = db.query(Skill).filter(Skill.skill_id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    update_data = skill_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(skill, key, value)
    
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/{skill_id}", status_code=204)
def delete_skill(skill_id: int, db: Session = Depends(get_db)):
    """Delete a skill"""
    skill = db.query(Skill).filter(Skill.skill_id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(skill)
    db.commit()
    return None
