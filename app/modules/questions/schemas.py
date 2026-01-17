from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List, Literal
from datetime import datetime

# ============================================================================
# Request Schemas
# ============================================================================

class QuestionTemplateCreate(BaseModel):
    """Schema for creating a new question template"""
    module: str = Field(..., min_length=1, max_length=100, description="Module name (e.g., 'Math Skill')")
    category: str = Field(..., min_length=1, max_length=100, description="Category (e.g., 'Fundamentals')")
    topic: str = Field(..., min_length=1, max_length=100, description="Topic (e.g., 'Addition')")
    subtopic: str = Field(..., min_length=1, max_length=100, description="Subtopic (e.g., 'Addition of 2 numbers')")
    format: str = Field(..., min_length=1, max_length=200, description="Question format (e.g., 'format1: 22+22')")
    difficulty: str = Field(..., min_length=1, max_length=50, description="Difficulty level (e.g., 'easy', 'medium', 'hard')")
    type: Literal["mcq", "user_input", "image_based", "code_based"] = Field(..., description="Question type")
    dynamic_question: str = Field(..., min_length=10, max_length=50000, description="Python code to generate question")
    logical_answer: str = Field(..., min_length=10, max_length=50000, description="Python code to validate answer")
    
    @validator('dynamic_question', 'logical_answer')
    def validate_python_code(cls, v):
        """Basic validation that code is not empty and has reasonable structure"""
        if not v.strip():
            raise ValueError("Code cannot be empty")
        if 'def ' not in v:
            raise ValueError("Code must define a function")
        return v


class QuestionTemplateUpdate(BaseModel):
    """Schema for updating an existing question template"""
    module: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    topic: Optional[str] = Field(None, min_length=1, max_length=100)
    subtopic: Optional[str] = Field(None, min_length=1, max_length=100)
    format: Optional[str] = Field(None, min_length=1, max_length=200)
    difficulty: Optional[str] = Field(None, min_length=1, max_length=50)
    type: Optional[Literal["mcq", "user_input", "image_based", "code_based"]] = None
    dynamic_question: Optional[str] = Field(None, min_length=10, max_length=50000)
    logical_answer: Optional[str] = Field(None, min_length=10, max_length=50000)
    status: Optional[Literal["draft", "active", "inactive"]] = None


class QuestionTemplatePreviewRequest(BaseModel):
    """Schema for previewing a template"""
    count: int = Field(default=3, ge=1, le=10, description="Number of sample questions to generate")


class QuestionGenerationJobCreate(BaseModel):
    """Schema for creating a question generation job"""
    template_id: int = Field(..., gt=0, description="Template ID to generate questions from")
    requested_count: int = Field(..., ge=1, le=1000, description="Number of questions to generate")
    generation_seed: Optional[str] = Field(None, max_length=100, description="Random seed for reproducibility")
    generation_params: Optional[Dict[str, Any]] = Field(None, description="Additional generation parameters")


# ============================================================================
# Response Schemas
# ============================================================================

class QuestionTemplateResponse(BaseModel):
    """Schema for question template response"""
    template_id: int
    module: str
    category: str
    topic: str
    subtopic: str
    format: str
    difficulty: str
    type: str
    status: str
    created_by_user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class QuestionTemplateDetailResponse(QuestionTemplateResponse):
    """Schema for detailed template response (includes code)"""
    dynamic_question: str
    logical_answer: str
    preview_data: Optional[Dict[str, Any]]
    preview_html: Optional[str]
    
    class Config:
        from_attributes = True


class QuestionTemplateListResponse(BaseModel):
    """Schema for paginated template list"""
    templates: List[QuestionTemplateResponse]
    total: int
    limit: int
    offset: int


class PreviewSample(BaseModel):
    """Schema for a single preview sample"""
    question_html: str
    answer_value: str
    variables_used: Optional[Dict[str, Any]] = None
    question_type: Optional[str] = None  # 'mcq', 'user_input', etc.
    options: Optional[List[Dict[str, str]]] = None  # For MCQ questions
    topic: Optional[str] = None  # Question topic if provided


class QuestionTemplatePreviewResponse(BaseModel):
    """Schema for template preview response"""
    preview_samples: List[PreviewSample]
    preview_data: Dict[str, Any]
    preview_html: str


class QuestionGenerationJobResponse(BaseModel):
    """Schema for question generation job response"""
    job_id: int
    template_id: int
    requested_count: int
    generated_count: int
    status: str
    created_by_user_id: int
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class GeneratedQuestionResponse(BaseModel):
    """Schema for generated question response"""
    generated_question_id: int
    template_id: int
    job_id: int
    question_html: str
    answer_value: str
    difficulty_snapshot: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class GeneratedQuestionDetailResponse(GeneratedQuestionResponse):
    """Schema for detailed generated question (includes debug info and MCQ options)"""
    variables_used: Optional[Dict[str, Any]]
    hash_signature: Optional[str]
    question_type: Optional[str] = None  # Extracted from variables_used
    options: Optional[List[Dict[str, str]]] = None  # For MCQ questions
    topic: Optional[str] = None  # Question topic if provided
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        """Custom from_orm to extract nested fields from variables_used"""
        data = {
            "generated_question_id": obj.generated_question_id,
            "template_id": obj.template_id,
            "job_id": obj.job_id,
            "question_html": obj.question_html,
            "answer_value": obj.answer_value,
            "difficulty_snapshot": obj.difficulty_snapshot,
            "created_at": obj.created_at,
            "variables_used": obj.variables_used,
            "hash_signature": obj.hash_signature,
        }
        
        # Extract MCQ-specific fields from variables_used
        if obj.variables_used:
            data["question_type"] = obj.variables_used.get("question_type")
            data["options"] = obj.variables_used.get("options")
            data["topic"] = obj.variables_used.get("topic")
        
        return cls(**data)


class GeneratedQuestionListResponse(BaseModel):
    """Schema for paginated generated questions list"""
    questions: List[GeneratedQuestionResponse]
    total: int
    limit: int
    offset: int


# ============================================================================
# Standard API Response Envelope
# ============================================================================

class APIResponse(BaseModel):
    """Standard response envelope following SkillBuilder API standards"""
    success: bool
    data: Optional[Any] = None
    error: Optional[Dict[str, str]] = None


class ErrorDetail(BaseModel):
    """Error detail structure"""
    code: str
    message: str
