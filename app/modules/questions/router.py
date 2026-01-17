"""
FastAPI router for question template management and generation.
All endpoints follow SkillBuilder API standards.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.questions import schemas, service
from app.modules.questions.executor import CodeExecutionError, CodeTimeoutError

router = APIRouter(prefix="/question-templates", tags=["Question Templates"])
generation_router = APIRouter(prefix="/question-generation-jobs", tags=["Question Generation"])
questions_router = APIRouter(prefix="/generated-questions", tags=["Generated Questions"])


# ============================================================================
# Template Management Endpoints
# ============================================================================

@router.post("", response_model=schemas.APIResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    template_data: schemas.QuestionTemplateCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new question template.
    
    - Validates Python code syntax
    - Sets status to 'draft' by default
    - Returns created template
    """
    try:
        template = service.QuestionTemplateService.create_template(
            db=db,
            template_data=template_data,
            user_id=current_user.user_id if current_user else None
        )
        
        return schemas.APIResponse(
            success=True,
            data=schemas.QuestionTemplateResponse.from_orm(template),
            error=None
        )
    
    except ValueError as e:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="INVALID_PYTHON_CODE",
                message=str(e)
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.get("", response_model=schemas.APIResponse)
def list_templates(
    module: Optional[str] = Query(None, description="Filter by module"),
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(50, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List question templates with filtering and pagination.
    
    - Supports filtering by module, category, difficulty, status
    - Paginated results (max 100 per page)
    - Returns total count
    """
    try:
        templates, total = service.QuestionTemplateService.list_templates(
            db=db,
            module=module,
            category=category,
            difficulty=difficulty,
            status=status,
            limit=limit,
            offset=offset
        )
        
        return schemas.APIResponse(
            success=True,
            data=schemas.QuestionTemplateListResponse(
                templates=[schemas.QuestionTemplateResponse.from_orm(t) for t in templates],
                total=total,
                limit=limit,
                offset=offset
            ).dict(),
            error=None
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.get("/{template_id}", response_model=schemas.APIResponse)
def get_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a single template by ID.
    
    - Returns full template details including code
    - Returns 404 if not found
    """
    template = service.QuestionTemplateService.get_template(db=db, template_id=template_id)
    
    if not template:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="TEMPLATE_NOT_FOUND",
                message=f"Template with ID {template_id} not found"
            ).dict()
        )
    
    return schemas.APIResponse(
        success=True,
        data=schemas.QuestionTemplateDetailResponse.from_orm(template).dict(),
        error=None
    )


@router.patch("/{template_id}", response_model=schemas.APIResponse)
def update_template(
    template_id: int,
    update_data: schemas.QuestionTemplateUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update a question template.
    
    - Partial update (only provided fields are updated)
    - Validates code syntax if code is being updated
    - Returns updated template
    """
    try:
        template = service.QuestionTemplateService.update_template(
            db=db,
            template_id=template_id,
            update_data=update_data
        )
        
        if not template:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="TEMPLATE_NOT_FOUND",
                    message=f"Template with ID {template_id} not found"
                ).dict()
            )
        
        return schemas.APIResponse(
            success=True,
            data=schemas.QuestionTemplateDetailResponse.from_orm(template).dict(),
            error=None
        )
    
    except ValueError as e:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="INVALID_PYTHON_CODE",
                message=str(e)
            ).dict()
        )


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete a template (soft delete - sets status to 'inactive').
    
    - Returns 204 No Content on success
    - Returns 404 if template not found
    """
    success = service.QuestionTemplateService.delete_template(db=db, template_id=template_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "TEMPLATE_NOT_FOUND", "message": f"Template with ID {template_id} not found"}
        )
    
    return None


@router.post("/{template_id}/preview", response_model=schemas.APIResponse)
def preview_template(
    template_id: int,
    preview_request: schemas.QuestionTemplatePreviewRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Preview a template by generating sample questions.
    
    - Executes template code to generate sample questions
    - Updates preview_data and preview_html in database
    - Returns sample questions and preview HTML
    """
    try:
        preview_result = service.QuestionTemplateService.preview_template(
            db=db,
            template_id=template_id,
            count=preview_request.count
        )
        
        return schemas.APIResponse(
            success=True,
            data=schemas.QuestionTemplatePreviewResponse(**preview_result).dict(),
            error=None
        )
    
    except ValueError as e:
        if "not found" in str(e).lower():
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="TEMPLATE_NOT_FOUND",
                    message=str(e)
                ).dict()
            )
        else:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="CODE_EXECUTION_ERROR",
                    message=str(e)
                ).dict()
            )
    
    except CodeTimeoutError as e:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="CODE_EXECUTION_TIMEOUT",
                message=str(e)
            ).dict()
        )


# ============================================================================
# Question Generation Endpoints
# ============================================================================

@generation_router.post("", response_model=schemas.APIResponse, status_code=status.HTTP_201_CREATED)
def create_generation_job(
    job_data: schemas.QuestionGenerationJobCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a question generation job.
    
    - Creates job in 'pending' status
    - Job will be processed by background worker
    - Returns job details immediately
    """
    try:
        job = service.QuestionGenerationService.create_generation_job(
            db=db,
            job_data=job_data,
            user_id=current_user.user_id if current_user else None
        )
        
        # TODO: Trigger background worker to process job
        # For now, process synchronously (will move to async later)
        try:
            service.QuestionGenerationService.process_generation_job(db=db, job_id=job.job_id)
        except Exception as e:
            # Job will remain in failed status
            pass
        
        return schemas.APIResponse(
            success=True,
            data=schemas.QuestionGenerationJobResponse.from_orm(job).dict(),
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


@generation_router.get("/{job_id}", response_model=schemas.APIResponse)
def get_generation_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get generation job status.
    
    - Returns job details including status and progress
    - Status values: pending, processing, completed, failed
    """
    job = service.QuestionGenerationService.get_job(db=db, job_id=job_id)
    
    if not job:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="JOB_NOT_FOUND",
                message=f"Job with ID {job_id} not found"
            ).dict()
        )
    
    return schemas.APIResponse(
        success=True,
        data=schemas.QuestionGenerationJobResponse.from_orm(job).dict(),
        error=None
    )


# ============================================================================
# Generated Questions Endpoints
# ============================================================================

@questions_router.get("", response_model=schemas.APIResponse)
def list_generated_questions(
    template_id: Optional[int] = Query(None, description="Filter by template ID"),
    job_id: Optional[int] = Query(None, description="Filter by job ID"),
    limit: int = Query(50, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List generated questions with filtering and pagination.
    
    - Filter by template_id or job_id
    - Paginated results (max 100 per page)
    """
    questions, total = service.QuestionGenerationService.list_generated_questions(
        db=db,
        template_id=template_id,
        job_id=job_id,
        limit=limit,
        offset=offset
    )
    
    return schemas.APIResponse(
        success=True,
        data=schemas.GeneratedQuestionListResponse(
            questions=[schemas.GeneratedQuestionResponse.from_orm(q) for q in questions],
            total=total,
            limit=limit,
            offset=offset
        ).dict(),
        error=None
    )


@questions_router.get("/{question_id}", response_model=schemas.APIResponse)
def get_generated_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a single generated question by ID.
    
    - Returns full question details including debug info
    """
    question = service.QuestionGenerationService.get_generated_question(db=db, question_id=question_id)
    
    if not question:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="QUESTION_NOT_FOUND",
                message=f"Question with ID {question_id} not found"
            ).dict()
        )
    
    return schemas.APIResponse(
        success=True,
        data=schemas.GeneratedQuestionDetailResponse.from_orm(question).dict(),
        error=None
    )
