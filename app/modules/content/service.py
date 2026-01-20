"""
Service layer for content management.
Handles business logic for grades, categories, and skills.
"""

from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
from app.modules.content.models import Grade, Category, Skill
from app.modules.content import schemas


class GradeService:
    """Service for managing grades"""
    
    @staticmethod
    def create_grade(db: Session, grade_data: schemas.GradeCreate) -> Grade:
        """Create a new grade"""
        grade = Grade(**grade_data.dict())
        db.add(grade)
        db.commit()
        db.refresh(grade)
        return grade
    
    @staticmethod
    def get_grade(db: Session, grade_id: int) -> Optional[Grade]:
        """Get a grade by ID"""
        return db.query(Grade).filter(Grade.id == grade_id, Grade.is_active == True).first()
    
    @staticmethod
    def list_grades(db: Session) -> Tuple[List[Grade], int]:
        """List all active grades"""
        query = db.query(Grade).filter(Grade.is_active == True).order_by(Grade.display_order)
        total = query.count()
        grades = query.all()
        return grades, total
    
    @staticmethod
    def update_grade(db: Session, grade_id: int, update_data: schemas.GradeUpdate) -> Optional[Grade]:
        """Update a grade"""
        grade = db.query(Grade).filter(Grade.id == grade_id).first()
        if not grade:
            return None
        
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(grade, key, value)
        
        db.commit()
        db.refresh(grade)
        return grade
    
    @staticmethod
    def delete_grade(db: Session, grade_id: int) -> bool:
        """Soft delete a grade"""
        grade = db.query(Grade).filter(Grade.id == grade_id).first()
        if not grade:
            return False
        
        grade.is_active = False
        db.commit()
        return True
    
    @staticmethod
    def reorder_grades(db: Session, item_ids: List[int]) -> bool:
        """Reorder grades based on provided ID list"""
        try:
            for index, grade_id in enumerate(item_ids):
                db.query(Grade).filter(Grade.id == grade_id).update(
                    {"display_order": index}
                )
            db.commit()
            return True
        except Exception:
            db.rollback()
            return False
    
    @staticmethod
    def get_grade_content(db: Session, grade_id: int) -> Optional[dict]:
        """Get full hierarchical content for a grade"""
        grade = GradeService.get_grade(db, grade_id)
        if not grade:
            return None
        
        # Get top-level categories
        categories = CategoryService.get_category_tree(db, grade_id)
        
        return {
            "gradeId": grade.id,
            "gradeName": grade.name,
            "categories": categories
        }


class CategoryService:
    """Service for managing categories"""
    
    @staticmethod
    def create_category(db: Session, category_data: schemas.CategoryCreate) -> Category:
        """Create a new category"""
        # Validate parent exists if parent_id is provided
        if category_data.parent_id:
            parent = db.query(Category).filter(Category.id == category_data.parent_id).first()
            if not parent:
                raise ValueError(f"Parent category {category_data.parent_id} not found")
        
        category = Category(**category_data.dict())
        db.add(category)
        db.commit()
        db.refresh(category)
        return category
    
    @staticmethod
    def get_category(db: Session, category_id: int) -> Optional[Category]:
        """Get a category by ID"""
        return db.query(Category).filter(Category.id == category_id, Category.is_active == True).first()
    
    @staticmethod
    def update_category(db: Session, category_id: int, update_data: schemas.CategoryUpdate) -> Optional[Category]:
        """Update a category"""
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            return None
        
        update_dict = update_data.dict(exclude_unset=True)
        
        # Validate parent if being updated
        if 'parent_id' in update_dict and update_dict['parent_id']:
            parent = db.query(Category).filter(Category.id == update_dict['parent_id']).first()
            if not parent:
                raise ValueError(f"Parent category {update_dict['parent_id']} not found")
            # Prevent circular reference
            if update_dict['parent_id'] == category_id:
                raise ValueError("Category cannot be its own parent")
        
        for key, value in update_dict.items():
            setattr(category, key, value)
        
        db.commit()
        db.refresh(category)
        return category
    
    @staticmethod
    def delete_category(db: Session, category_id: int) -> bool:
        """Soft delete a category (cascades to children)"""
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            return False
        
        # Soft delete this category and all children recursively
        CategoryService._soft_delete_recursive(db, category)
        db.commit()
        return True
    
    @staticmethod
    def _soft_delete_recursive(db: Session, category: Category):
        """Recursively soft delete category and children"""
        category.is_active = False
        for child in category.children:
            CategoryService._soft_delete_recursive(db, child)
    
    @staticmethod
    def reorder_categories(db: Session, parent_id: Optional[int], item_ids: List[int]) -> bool:
        """Reorder categories within the same parent"""
        try:
            for index, category_id in enumerate(item_ids):
                db.query(Category).filter(
                    Category.id == category_id,
                    Category.parent_id == parent_id
                ).update({"display_order": index})
            db.commit()
            return True
        except Exception:
            db.rollback()
            return False
    
    @staticmethod
    def get_category_tree(db: Session, grade_id: int, parent_id: Optional[int] = None) -> List[dict]:
        """Recursively build category tree"""
        categories = db.query(Category).filter(
            Category.grade_id == grade_id,
            Category.parent_id == parent_id,
            Category.is_active == True
        ).order_by(Category.display_order).all()
        
        result = []
        for category in categories:
            # Get skills for this category
            skills = db.query(Skill).filter(
                Skill.category_id == category.id,
                Skill.is_active == True
            ).order_by(Skill.display_order).all()
            
            # Recursively get children
            children = CategoryService.get_category_tree(db, grade_id, category.id)
            
            result.append({
                "id": category.id,
                "code": category.code,
                "name": category.name,
                "display_order": category.display_order,
                "children": children,
                "skills": [
                    {
                        "id": skill.id,
                        "code": skill.code,
                        "title": skill.title,
                        "display_order": skill.display_order
                    }
                    for skill in skills
                ]
            })
        
        return result


class SkillService:
    """Service for managing skills"""
    
    @staticmethod
    def create_skill(db: Session, skill_data: schemas.SkillCreate) -> Skill:
        """Create a new skill"""
        # Validate category exists
        category = db.query(Category).filter(Category.id == skill_data.category_id).first()
        if not category:
            raise ValueError(f"Category {skill_data.category_id} not found")
        
        skill = Skill(**skill_data.dict())
        db.add(skill)
        db.commit()
        db.refresh(skill)
        return skill
    
    @staticmethod
    def get_skill(db: Session, skill_id: int) -> Optional[Skill]:
        """Get a skill by ID"""
        return db.query(Skill).filter(Skill.id == skill_id, Skill.is_active == True).first()
    
    @staticmethod
    def update_skill(db: Session, skill_id: int, update_data: schemas.SkillUpdate) -> Optional[Skill]:
        """Update a skill"""
        skill = db.query(Skill).filter(Skill.id == skill_id).first()
        if not skill:
            return None
        
        update_dict = update_data.dict(exclude_unset=True)
        
        # Validate category if being updated
        if 'category_id' in update_dict:
            category = db.query(Category).filter(Category.id == update_dict['category_id']).first()
            if not category:
                raise ValueError(f"Category {update_dict['category_id']} not found")
        
        for key, value in update_dict.items():
            setattr(skill, key, value)
        
        db.commit()
        db.refresh(skill)
        return skill
    
    @staticmethod
    def delete_skill(db: Session, skill_id: int) -> bool:
        """Soft delete a skill"""
        skill = db.query(Skill).filter(Skill.id == skill_id).first()
        if not skill:
            return False
        
        skill.is_active = False
        db.commit()
        return True
    
    @staticmethod
    def reorder_skills(db: Session, category_id: int, item_ids: List[int]) -> bool:
        """Reorder skills within a category"""
        try:
            for index, skill_id in enumerate(item_ids):
                db.query(Skill).filter(
                    Skill.id == skill_id,
                    Skill.category_id == category_id
                ).update({"display_order": index})
            db.commit()
            return True
        except Exception:
            db.rollback()
            return False
