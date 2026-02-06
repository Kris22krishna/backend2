"""
FastAPI router for question template management and generation.
All endpoints follow SkillBuilder API standards.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
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
    grade_level: Optional[int] = Query(None, ge=1, le=12, description="Filter by grade level"),
    module: Optional[str] = Query(None, description="Filter by module"),
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search term for topic, subtopic"),
    limit: int = Query(50, ge=1, le=1000, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user) # Add current_user
):
    """
    List question templates with filtering and pagination.
    
    - Supports filtering by grade_level, module, category, difficulty, status
    - Paginated results (max 100 per page)
    - Returns total count
    """
    try:
        print(f"DEBUG: V1 list_templates called grade={grade_level}")
        templates, total = service.QuestionTemplateService.list_templates(
            db=db,
            current_user=current_user, # Pass current_user
            grade_level=grade_level,
            module=module,
            category=category,
            difficulty=difficulty,
            status=status,
            search=search,
            limit=limit,
            offset=offset
        )
        print(f"DEBUG: V1 found {total} templates")
        
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
    try:
        success = service.QuestionTemplateService.delete_template(db=db, template_id=template_id)
    except IntegrityError:
         raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "TEMPLATE_IN_USE", "message": "Cannot delete template because it is in use."}
        )
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )
    
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


@router.get("/{template_id}/practice", response_model=schemas.APIResponse)
def get_practice_questions(
    template_id: int,
    count: int = Query(default=10, ge=1, le=20, description="Number of questions to generate"),
    db: Session = Depends(get_db)
):
    """
    Generate practice questions for a template (PUBLIC - no auth required).
    
    This endpoint is for students to practice with dynamically generated questions.
    It generates fresh questions on-the-fly without storing them.
    """
    try:
        preview_result = service.QuestionTemplateService.preview_template(
            db=db,
            template_id=template_id,
            count=count
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
                    code="GENERATION_ERROR",
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

@questions_router.get("/stats", response_model=schemas.APIResponse)
def get_question_stats(
    template_id: Optional[int] = Query(None, description="Filter by template ID"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get statistics for generated questions.
    Returns count of questions per template.
    """
    try:
        stats = service.QuestionGenerationService.get_question_stats(db=db, template_id=template_id, current_user=current_user)
        
        # Format response
        data = [
            {"template_id": s.template_id, "count": s.count}
            for s in stats
        ]
        
        # Enrich with template names if possible (optimization: fetch templates in one go or join)
        # For now, client can join or we can do a join query in service.
        # Let's keep it simple: just IDs and counts. Client likely has templates loaded or can fetch.
        
        return schemas.APIResponse(
            success=True,
            data=data,
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@questions_router.get("", response_model=schemas.APIResponse)
def list_generated_questions(
    template_id: Optional[int] = Query(None, description="Filter by template ID"),
    job_id: Optional[int] = Query(None, description="Filter by job ID"),
    limit: int = Query(50, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    random: bool = Query(False, description="Return questions in random order"),
    db: Session = Depends(get_db)
):
    """
    List generated questions with filtering and pagination (PUBLIC - no auth required).
    
    - Filter by template_id or job_id
    - Paginated results (max 100 per page)
    - Optional random ordering
    """
    questions, total = service.QuestionGenerationService.list_generated_questions(
        db=db,
        current_user=None,
        template_id=template_id,
        job_id=job_id,
        limit=limit,
        offset=offset,
        random_order=random
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
    db: Session = Depends(get_db)
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


# ============================================================================
# Syllabus Configuration Endpoints
# ============================================================================

@router.get("/syllabus-config/{grade_level}", response_model=schemas.APIResponse)
def get_syllabus_config(
    grade_level: int,
    db: Session = Depends(get_db)
):
    """Get syllabus configuration for a grade"""
    config = service.SyllabusService.get_config(db=db, grade_level=grade_level)
    
    if not config:
        return schemas.APIResponse(success=True, data=None, error=None)
        
    return schemas.APIResponse(
        success=True,
        data=schemas.SyllabusConfigResponse.from_orm(config).dict(),
        error=None
    )

@router.post("/syllabus-config/{grade_level}", response_model=schemas.APIResponse)
def save_syllabus_config(
    grade_level: int,
    config_data: schemas.SyllabusConfigCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Save syllabus configuration for a grade"""
    try:
        config = service.SyllabusService.save_config(
            db=db, 
            grade_level=grade_level, 
            config_data=config_data.config
        )
        
        return schemas.APIResponse(
            success=True,
            data=schemas.SyllabusConfigResponse.from_orm(config).dict(),
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.get("/syllabus/{grade_level}", response_model=schemas.APIResponse)
def get_grade_syllabus(
    grade_level: int,
    db: Session = Depends(get_db)
):
    """
    Get the complete hierarchical syllabus for a grade (PUBLIC - no auth required).
    Matches the specific JSON structure requested by frontend.
    """
    try:
        data = service.SyllabusService.get_grade_syllabus(db=db, grade_level=grade_level, current_user=None)
        return schemas.APIResponse(success=True, data=data, error=None)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


# ============================================================================
# New Question Generation Template Endpoints (v2)
# ============================================================================

from app.modules.questions.models import QuestionGeneration

new_templates_router = APIRouter(prefix="/question-generation-templates", tags=["Question Generation Templates (v2)"])


@new_templates_router.post("", response_model=schemas.APIResponse, status_code=status.HTTP_201_CREATED)
def create_generation_template(
    template_data: schemas.QuestionGenerationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new question generation template (v2 with skill-based design).
    """
    try:
        # Check for existing templates with same skill_id and type to auto-increment format
        last_template = db.query(QuestionGeneration).filter(
            QuestionGeneration.skill_id == template_data.skill_id,
            QuestionGeneration.type == template_data.type
        ).order_by(QuestionGeneration.format.desc()).first()
        
        new_format = template_data.format
        if last_template:
            new_format = last_template.format + 1
        elif new_format is None or new_format == 0:
             # Default to 1 if not provided and no history
             new_format = 1
             
        # Create dict from pydantic model and override format
        data_dict = template_data.model_dump()
        data_dict['format'] = new_format
        if current_user:
            data_dict['created_by_user_id'] = current_user.user_id
        
        template = QuestionGeneration(**data_dict)
        db.add(template)
        db.commit()
        db.refresh(template)
        
        return schemas.APIResponse(
            success=True,
            data=schemas.QuestionGenerationResponse.model_validate(template).model_dump(),
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )




@new_templates_router.post("/preview", response_model=schemas.APIResponse)
def preview_generation_template(
    body: schemas.QuestionGenerationCreate,
    count: int = Query(3, ge=1, le=5),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Preview a v2 template by executing its Python scripts.
    Accepts full template data (no need to save first).
    """
    try:
        preview_result = service.QuestionGenerationService.preview_generation_v2(
            db=db,
            question_code=body.question_template,
            answer_code=body.answer_template,
            solution_code=body.solution_template,
            count=count
        )
        
        return schemas.APIResponse(
            success=True,
            data=preview_result,
            error=None
        )
    except ValueError as e:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="CODE_EXECUTION_ERROR",
                message=str(e)
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@new_templates_router.get("", response_model=schemas.APIResponse)
def list_generation_templates(
    skill_id: Optional[int] = Query(None, description="Filter by skill ID"),
    grade: Optional[int] = Query(None, ge=1, le=12, description="Filter by grade"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    search: Optional[str] = Query(None, description="Search term"),
    limit: int = Query(50, ge=1, le=1000, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List question generation templates (v2).
    """
    try:
        query = db.query(QuestionGeneration)
        
        if current_user:
            print(f"DEBUG: list_generation_templates user={current_user.user_id} type={current_user.user_type}")
        else:
             print("DEBUG: list_generation_templates user=None")
             
        if current_user and current_user.user_type != 'admin':
            query = query.filter(QuestionGeneration.created_by_user_id == current_user.user_id)

        if skill_id:
            query = query.filter(QuestionGeneration.skill_id == skill_id)
        if grade:
            print(f"DEBUG: Filtering by grade={grade}")
            query = query.filter(QuestionGeneration.grade == grade)
        if difficulty:
            query = query.filter(QuestionGeneration.difficulty == difficulty)
        
        if search:
             print(f"DEBUG: Filtering V2 by search={search}")
             from sqlalchemy import or_
             search_term = f"%{search}%"
             search_filters = [
                 QuestionGeneration.skill_name.ilike(search_term),
                 QuestionGeneration.category.ilike(search_term)
             ]
             if search.isdigit():
                 search_filters.append(QuestionGeneration.template_id == int(search))
             
             query = query.filter(or_(*search_filters))
        
        total = query.count()
        print(f"DEBUG: Found {total} templates (before paging)")
        templates = query.order_by(QuestionGeneration.template_id.desc()).offset(offset).limit(limit).all()
        
        return schemas.APIResponse(
            success=True,
            data={
                "templates": [schemas.QuestionGenerationResponse.model_validate(t).model_dump() for t in templates],
                "total": total,
                "limit": limit,
                "offset": offset
            },
            error=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@new_templates_router.get("/{template_id}", response_model=schemas.APIResponse)
def get_generation_template(
    template_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single generation template by ID (v2).
    """
    template = db.query(QuestionGeneration).filter(QuestionGeneration.template_id == template_id).first()
    
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
        data=schemas.QuestionGenerationResponse.model_validate(template).model_dump(),
        error=None
    )


@new_templates_router.get("/by-skill/{skill_id}/practice", response_model=schemas.APIResponse)
def get_practice_questions_by_skill(
    skill_id: int,
    count: int = Query(default=5, ge=1, le=20, description="Number of questions to generate"),
    type: Optional[str] = Query(None, description="Preferred format: MCQ or User Input"),
    db: Session = Depends(get_db)
):
    """
    Generate practice questions for a specific skill (PUBLIC/STUDENT).
    Finds the latest active v2 template for the skill and generates questions.
    """
    try:
        # Find templates for this skill
        templates = db.query(QuestionGeneration).filter(
            QuestionGeneration.skill_id == skill_id
        ).order_by(QuestionGeneration.template_id.desc()).all()
        
        if not templates:
            return schemas.APIResponse(
                success=False,
                data=None,
                error=schemas.ErrorDetail(
                    code="TEMPLATE_NOT_FOUND",
                    message=f"No practice content found for skill ID {skill_id}"
                ).dict()
            )

        # Detect available types
        available_types = list(set([t.type for t in templates if t.type]))
        
        # Logic: If type NOT specified and we have multiple distinct types, ask user to choose
        # Exception: If count=1 (Preview Mode), just pick a default/latest instead of asking
        if count > 1 and not type and len(available_types) > 1:
            # Check if they are actually different types (ignore case)
            unique_types_normalized = set(t.upper() for t in available_types)
            if len(unique_types_normalized) > 1:
                return schemas.APIResponse(
                    success=True,
                    data={
                        "selection_needed": True,
                        "available_types": available_types,
                        "skill_id": skill_id
                    },
                    error=None
                )

        # Select template
        template = None
        if type:
            # Find first template matching requested type
            template = next((t for t in templates if t.type and t.type.upper() == type.upper()), None)
        
        if not template:
            # Fallback: Prioritize MCQ if available, else latest
            template = next((t for t in templates if t.type and t.type.upper() == 'MCQ'), templates[0])
            
        preview_result = service.QuestionGenerationService.preview_generation_v2(
            db=db,
            question_code=template.question_template,
            answer_code=template.answer_template,
            solution_code=template.solution_template,
            count=count
        )
        
        # Inject metadata so frontend can display skill info
        preview_result["template_metadata"] = {
            "template_id": template.template_id,
            "skill_id": template.skill_id,
            "skill_name": template.skill_name,
            "category": template.category,
            "grade": template.grade,
            "difficulty": template.difficulty,
            "topic": template.skill_name # Fallback for V1 UI compatibility
        }
        
        return schemas.APIResponse(
            success=True,
            data=preview_result,
            error=None
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="GENERATION_ERROR",
                message=str(e)
            ).dict()
        )


@new_templates_router.patch("/{template_id}", response_model=schemas.APIResponse)
def update_generation_template(
    template_id: int,
    update_data: schemas.QuestionGenerationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update a question generation template (v2).
    """
    template = db.query(QuestionGeneration).filter(QuestionGeneration.template_id == template_id).first()
    
    if not template:
        return schemas.APIResponse(
            success=False,
            data=None,
            error=schemas.ErrorDetail(
                code="TEMPLATE_NOT_FOUND",
                message=f"Template with ID {template_id} not found"
            ).dict()
        )
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(template, key, value)
    
    db.commit()
    db.refresh(template)
    
    return schemas.APIResponse(
        success=True,
        data=schemas.QuestionGenerationResponse.model_validate(template).model_dump(),
        error=None
    )


@new_templates_router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_generation_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete a question generation template (v2).
    """
    template = db.query(QuestionGeneration).filter(QuestionGeneration.template_id == template_id).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "TEMPLATE_NOT_FOUND", "message": f"Template with ID {template_id} not found"}
        )
    
    try:
        db.delete(template)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "TEMPLATE_IN_USE", "message": "Cannot delete template because it is in use by generated questions or jobs."}
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )
    return None
