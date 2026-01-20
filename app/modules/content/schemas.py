from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# ============================================================================
# Request Schemas
# ============================================================================

class GradeCreate(BaseModel):
    """Schema for creating a new grade"""
    name: str = Field(..., min_length=1, max_length=100, description="Grade name (e.g., 'Class 1')")
    display_order: int = Field(default=0, description="Display order for sorting")


class GradeUpdate(BaseModel):
    """Schema for updating a grade"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryCreate(BaseModel):
    """Schema for creating a new category"""
    grade_id: int = Field(..., gt=0, description="Grade ID this category belongs to")
    parent_id: Optional[int] = Field(None, description="Parent category ID (null for top-level)")
    code: Optional[str] = Field(None, max_length=10, description="Category code (e.g., 'A', 'B')")
    name: str = Field(..., min_length=1, max_length=200, description="Category name")
    display_order: int = Field(default=0, description="Display order within parent")


class CategoryUpdate(BaseModel):
    """Schema for updating a category"""
    parent_id: Optional[int] = None
    code: Optional[str] = Field(None, max_length=10)
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class SkillCreate(BaseModel):
    """Schema for creating a new skill"""
    category_id: int = Field(..., gt=0, description="Category ID this skill belongs to")
    code: str = Field(..., min_length=1, max_length=20, description="Skill code (e.g., 'A.1')")
    title: str = Field(..., min_length=1, max_length=500, description="Skill title")
    display_order: int = Field(default=0, description="Display order within category")


class SkillUpdate(BaseModel):
    """Schema for updating a skill"""
    category_id: Optional[int] = Field(None, gt=0)
    code: Optional[str] = Field(None, min_length=1, max_length=20)
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class ReorderRequest(BaseModel):
    """Schema for reordering items"""
    item_ids: List[int] = Field(..., min_items=1, description="List of item IDs in new order")


# ============================================================================
# Response Schemas
# ============================================================================

class SkillResponse(BaseModel):
    """Schema for skill response"""
    id: int
    code: str
    title: str
    display_order: int
    
    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    """Schema for category response with recursive children"""
    id: int
    code: Optional[str]
    name: str
    display_order: int
    children: List['CategoryResponse'] = []
    skills: List[SkillResponse] = []
    
    class Config:
        from_attributes = True


class GradeResponse(BaseModel):
    """Schema for grade response"""
    id: int
    name: str
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class GradeContentResponse(BaseModel):
    """Schema for full grade content with hierarchical structure"""
    gradeId: int
    gradeName: str
    categories: List[CategoryResponse]


class GradeListResponse(BaseModel):
    """Schema for list of grades"""
    grades: List[GradeResponse]
    total: int


# ============================================================================
# Standard API Response Envelope
# ============================================================================

class APIResponse(BaseModel):
    """Standard response envelope"""
    success: bool
    data: Optional[Any] = None
    error: Optional[dict] = None


class ErrorDetail(BaseModel):
    """Error detail structure"""
    code: str
    message: str
