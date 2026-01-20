"""
FastAPI router for content management.
Provides endpoints for managing grades, categories, and skills.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.content import schemas, service

router = APIRouter(prefix="/content", tags=["Content Management"])


# ============================================================================
# Public Endpoints
# ============================================================================

@router.get("/grades", response_model=schemas.APIResponse)
def list_grades(db: Session = Depends(get_db)):
    """
    List all active grades.
    Public endpoint - no authentication required.
    """
    try:
        grades, total = service.GradeService.list_grades(db)
        return schemas.APIResponse(
            success=True,
            data=schemas.GradeListResponse(
                grades=[schemas.GradeResponse.from_orm(g) for g in grades],
                total=total
            ).dict(),
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.get("/grades/{grade_id}", response_model=schemas.APIResponse)
def get_grade_content(grade_id: int, db: Session = Depends(get_db)):
    """
    Get full hierarchical content for a specific grade.
    Returns nested categories and skills.
    Public endpoint - no authentication required.
    """
    try:
        content = service.GradeService.get_grade_content(db, grade_id)
        
        if not content:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="GRADE_NOT_FOUND",
                    message=f"Grade with ID {grade_id} not found"
                ).dict()
            )
        
        return schemas.APIResponse(
            success=True,
            data=content,
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


# ============================================================================
# Admin Endpoints - Grades
# ============================================================================

@router.post("/grades", response_model=schemas.APIResponse, status_code=status.HTTP_201_CREATED)
def create_grade(
    grade_data: schemas.GradeCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new grade.
    Requires authentication.
    """
    try:
        grade = service.GradeService.create_grade(db, grade_data)
        return schemas.APIResponse(
            success=True,
            data=schemas.GradeResponse.from_orm(grade).dict(),
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.patch("/grades/{grade_id}", response_model=schemas.APIResponse)
def update_grade(
    grade_id: int,
    update_data: schemas.GradeUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update a grade.
    Requires authentication.
    """
    try:
        grade = service.GradeService.update_grade(db, grade_id, update_data)
        
        if not grade:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="GRADE_NOT_FOUND",
                    message=f"Grade with ID {grade_id} not found"
                ).dict()
            )
        
        return schemas.APIResponse(
            success=True,
            data=schemas.GradeResponse.from_orm(grade).dict(),
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.delete("/grades/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Soft delete a grade.
    Requires authentication.
    """
    success = service.GradeService.delete_grade(db, grade_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "GRADE_NOT_FOUND", "message": f"Grade with ID {grade_id} not found"}
        )
    
    return None


@router.patch("/grades/reorder", response_model=schemas.APIResponse)
def reorder_grades(
    reorder_data: schemas.ReorderRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Reorder grades.
    Requires authentication.
    """
    try:
        success = service.GradeService.reorder_grades(db, reorder_data.item_ids)
        
        if not success:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="REORDER_FAILED",
                    message="Failed to reorder grades"
                ).dict()
            )
        
        return schemas.APIResponse(
            success=True,
            data={"message": "Grades reordered successfully"},
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


# ============================================================================
# Admin Endpoints - Categories
# ============================================================================

@router.post("/categories", response_model=schemas.APIResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_data: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new category.
    Requires authentication.
    """
    try:
        category = service.CategoryService.create_category(db, category_data)
        return schemas.APIResponse(
            success=True,
            data=schemas.CategoryResponse.from_orm(category).dict(),
            error=None
        )
    except ValueError as e:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="INVALID_REQUEST",
                message=str(e)
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.patch("/categories/{category_id}", response_model=schemas.APIResponse)
def update_category(
    category_id: int,
    update_data: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update a category.
    Requires authentication.
    """
    try:
        category = service.CategoryService.update_category(db, category_id, update_data)
        
        if not category:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="CATEGORY_NOT_FOUND",
                    message=f"Category with ID {category_id} not found"
                ).dict()
            )
        
        return schemas.APIResponse(
            success=True,
            data=schemas.CategoryResponse.from_orm(category).dict(),
            error=None
        )
    except ValueError as e:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="INVALID_REQUEST",
                message=str(e)
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Soft delete a category (cascades to children).
    Requires authentication.
    """
    success = service.CategoryService.delete_category(db, category_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "CATEGORY_NOT_FOUND", "message": f"Category with ID {category_id} not found"}
        )
    
    return None


@router.patch("/categories/reorder", response_model=schemas.APIResponse)
def reorder_categories(
    reorder_data: schemas.ReorderRequest,
    parent_id: Optional[int] = Query(None, description="Parent category ID (null for top-level)"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Reorder categories within the same parent.
    Requires authentication.
    """
    try:
        success = service.CategoryService.reorder_categories(db, parent_id, reorder_data.item_ids)
        
        if not success:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="REORDER_FAILED",
                    message="Failed to reorder categories"
                ).dict()
            )
        
        return schemas.APIResponse(
            success=True,
            data={"message": "Categories reordered successfully"},
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


# ============================================================================
# Admin Endpoints - Skills
# ============================================================================

@router.post("/skills", response_model=schemas.APIResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_data: schemas.SkillCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new skill.
    Requires authentication.
    """
    try:
        skill = service.SkillService.create_skill(db, skill_data)
        return schemas.APIResponse(
            success=True,
            data=schemas.SkillResponse.from_orm(skill).dict(),
            error=None
        )
    except ValueError as e:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="INVALID_REQUEST",
                message=str(e)
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.patch("/skills/{skill_id}", response_model=schemas.APIResponse)
def update_skill(
    skill_id: int,
    update_data: schemas.SkillUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update a skill.
    Requires authentication.
    """
    try:
        skill = service.SkillService.update_skill(db, skill_id, update_data)
        
        if not skill:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="SKILL_NOT_FOUND",
                    message=f"Skill with ID {skill_id} not found"
                ).dict()
            )
        
        return schemas.APIResponse(
            success=True,
            data=schemas.SkillResponse.from_orm(skill).dict(),
            error=None
        )
    except ValueError as e:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="INVALID_REQUEST",
                message=str(e)
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Soft delete a skill.
    Requires authentication.
    """
    success = service.SkillService.delete_skill(db, skill_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SKILL_NOT_FOUND", "message": f"Skill with ID {skill_id} not found"}
        )
    
    return None


@router.patch("/skills/reorder", response_model=schemas.APIResponse)
def reorder_skills(
    reorder_data: schemas.ReorderRequest,
    category_id: int = Query(..., description="Category ID"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Reorder skills within a category.
    Requires authentication.
    """
    try:
        success = service.SkillService.reorder_skills(db, category_id, reorder_data.item_ids)
        
        if not success:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="REORDER_FAILED",
                    message="Failed to reorder skills"
                ).dict()
            )
        
        return schemas.APIResponse(
            success=True,
            data={"message": "Skills reordered successfully"},
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )
