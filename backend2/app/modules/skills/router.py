from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.core.cache import invalidate_cache
from .models import Skill
from .schemas import SkillCreate, SkillUpdate, SkillResponse

router = APIRouter(prefix="/skills", tags=["Skills"])

# In-memory cache for skills - simpler approach
from cachetools import TTLCache
from app.core.config import settings

# Create a separate cache specifically for skills
_skills_cache = TTLCache(maxsize=100, ttl=settings.CACHE_TTL)


def _get_cache_key_skills(grade: Optional[int]) -> str:
    """Generate cache key for skills by grade"""
    return f"skills:grade:{grade}" if grade else "skills:all"


def _skill_to_dict(skill: Skill) -> dict:
    """Convert Skill ORM object to dictionary to avoid lazy loading issues"""
    return {
        "skill_id": skill.skill_id,
        "grade": skill.grade,
        "topic": skill.topic,
        "skill_name": skill.skill_name
    }


@router.get("/", response_model=List[SkillResponse])
def get_all_skills(
    grade: int = None,
    db: Session = Depends(get_db)
):
    """Get all skills, optionally filtered by grade (cached)"""
    # Check if caching is enabled
    if not settings.CACHE_ENABLED:
        query = db.query(Skill)
        if grade:
            query = query.filter(Skill.grade == grade)
        return query.all()
    
    # Generate cache key based only on grade (not db session)
    cache_key = _get_cache_key_skills(grade)
    
    # Check cache
    if cache_key in _skills_cache:
        # Return cached data (already as dictionaries)
        return _skills_cache[cache_key]
    
    # Fetch from database
    query = db.query(Skill)
    if grade:
        query = query.filter(Skill.grade == grade)
    results = query.all()
    
    # Convert to dictionaries to avoid detached session issues
    dict_results = [_skill_to_dict(skill) for skill in results]
    
    # Store in cache as dictionaries
    _skills_cache[cache_key] = dict_results
    
    # Return dictionaries (Pydantic will handle conversion)
    return dict_results


@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill_by_id(skill_id: int, db: Session = Depends(get_db)):
    """Get a specific skill by its ID (cached)"""
    # Check if caching is enabled
    if not settings.CACHE_ENABLED:
        skill = db.query(Skill).filter(Skill.skill_id == skill_id).first()
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        return skill
    
    # Generate cache key
    cache_key = f"skills:id:{skill_id}"
    
    # Check cache
    if cache_key in _skills_cache:
        cached_skill = _skills_cache[cache_key]
        if cached_skill is None:
            raise HTTPException(status_code=404, detail="Skill not found")
        return cached_skill
    
    # Fetch from database
    skill = db.query(Skill).filter(Skill.skill_id == skill_id).first()
    
    if skill:
        # Convert to dictionary before caching
        skill_dict = _skill_to_dict(skill)
        _skills_cache[cache_key] = skill_dict
        return skill_dict
    else:
        # Cache None to avoid repeated lookups for non-existent IDs
        _skills_cache[cache_key] = None
        raise HTTPException(status_code=404, detail="Skill not found")


@router.post("/", response_model=SkillResponse, status_code=201)
def create_skill(skill_data: SkillCreate, db: Session = Depends(get_db)):
    """Create a new skill and invalidate cache"""
    skill = Skill(**skill_data.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    
    # Invalidate skills cache so new skill appears immediately
    _skills_cache.clear()
    
    return skill


@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, skill_data: SkillUpdate, db: Session = Depends(get_db)):
    """Update an existing skill and invalidate cache"""
    skill = db.query(Skill).filter(Skill.skill_id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    update_data = skill_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(skill, key, value)
    
    db.commit()
    db.refresh(skill)
    
    # Invalidate skills cache so updates appear immediately
    _skills_cache.clear()
    
    return skill


@router.delete("/{skill_id}", status_code=204)
def delete_skill(skill_id: int, db: Session = Depends(get_db)):
    """Delete a skill and invalidate cache"""
    skill = db.query(Skill).filter(Skill.skill_id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(skill)
    db.commit()
    
    # Invalidate skills cache so deletion appears immediately
    _skills_cache.clear()
    
    return None
