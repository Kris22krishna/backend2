"""
Business logic service for question templates.
Handles CRUD operations, code execution, and question generation.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
import hashlib
import json
from datetime import datetime

from app.modules.questions.models import (
    QuestionTemplate,
    QuestionGenerationJob,
    GeneratedQuestion
)
from app.modules.questions.schemas import (
    QuestionTemplateCreate,
    QuestionTemplateUpdate,
    QuestionGenerationJobCreate
)
from app.modules.questions.executor import executor, CodeExecutionError, CodeTimeoutError


class QuestionTemplateService:
    """Service for managing question templates"""
    
    @staticmethod
    def create_template(db: Session, template_data: QuestionTemplateCreate, user_id: int) -> QuestionTemplate:
        """Create a new question template"""
        
        # Validate code syntax before saving
        is_valid, error = executor.validate_code_syntax(template_data.dynamic_question)
        if not is_valid:
            raise ValueError(f"Invalid dynamic_question code: {error}")
        
        is_valid, error = executor.validate_code_syntax(template_data.logical_answer)
        if not is_valid:
            raise ValueError(f"Invalid logical_answer code: {error}")
        
        # Create template
        template = QuestionTemplate(
            grade_level=template_data.grade_level,
            module=template_data.module,
            category=template_data.category,
            topic=template_data.topic,
            subtopic=template_data.subtopic,
            format=template_data.format,
            difficulty=template_data.difficulty,
            type=template_data.type,
            dynamic_question=template_data.dynamic_question,
            logical_answer=template_data.logical_answer,
            status=template_data.status,
            created_by_user_id=user_id  # UUID from current_user
        )
        
        db.add(template)
        db.commit()
        db.refresh(template)
        
        return template
    
    @staticmethod
    def get_template(db: Session, template_id: int) -> Optional[QuestionTemplate]:
        """Get a single template by ID"""
        return db.query(QuestionTemplate).filter(QuestionTemplate.template_id == template_id).first()
    
    @staticmethod
    def list_templates(
        db: Session,
        grade_level: Optional[int] = None,
        module: Optional[str] = None,
        category: Optional[str] = None,
        difficulty: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> tuple[List[QuestionTemplate], int]:
        """List templates with filtering and pagination"""
        
        query = db.query(QuestionTemplate)
        
        # Apply filters
        if grade_level:
            query = query.filter(QuestionTemplate.grade_level == grade_level)
        if module:
            query = query.filter(QuestionTemplate.module == module)
        if category:
            query = query.filter(QuestionTemplate.category == category)
        if difficulty:
            query = query.filter(QuestionTemplate.difficulty == difficulty)
        if status:
            query = query.filter(QuestionTemplate.status == status)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        templates = query.order_by(QuestionTemplate.created_at.desc()).offset(offset).limit(limit).all()
        
        return templates, total
    
    @staticmethod
    def update_template(
        db: Session,
        template_id: int,
        update_data: QuestionTemplateUpdate
    ) -> Optional[QuestionTemplate]:
        """Update a template"""
        
        template = db.query(QuestionTemplate).filter(QuestionTemplate.template_id == template_id).first()
        if not template:
            return None
        
        # Validate code if being updated
        if update_data.dynamic_question:
            is_valid, error = executor.validate_code_syntax(update_data.dynamic_question)
            if not is_valid:
                raise ValueError(f"Invalid dynamic_question code: {error}")
        
        if update_data.logical_answer:
            is_valid, error = executor.validate_code_syntax(update_data.logical_answer)
            if not is_valid:
                raise ValueError(f"Invalid logical_answer code: {error}")
        
        # Update fields
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(template, field, value)
        
        db.commit()
        db.refresh(template)
        
        return template
    
    @staticmethod
    def delete_template(db: Session, template_id: int) -> bool:
        """Soft delete a template (set status to inactive)"""
        
        template = db.query(QuestionTemplate).filter(QuestionTemplate.template_id == template_id).first()
        if not template:
            return False
        
        template.status = "inactive"
        db.commit()
        
        return True
    
    @staticmethod
    def preview_template(db: Session, template_id: int, count: int = 3) -> Dict[str, Any]:
        """
        Generate preview samples for a template.
        Updates preview_data and preview_html in the database.
        """
        
        template = db.query(QuestionTemplate).filter(QuestionTemplate.template_id == template_id).first()
        if not template:
            raise ValueError("Template not found")
        
        # Generate sample questions
        samples = []
        for _ in range(count):
            try:
                result = executor.execute_generator(template.dynamic_question)
                
                sample = {
                    "question_html": result['question'],
                    "answer_value": str(result['answer']),
                    "variables_used": result.get('variables', {})
                }
                
                # Add MCQ-specific fields
                if 'options' in result:
                    sample['options'] = result['options']
                    sample['question_type'] = result.get('type', 'mcq')
                else:
                    sample['question_type'] = result.get('type', 'user_input')
                
                if 'topic' in result:
                    sample['topic'] = result['topic']
                
                samples.append(sample)
                
            except (CodeExecutionError, CodeTimeoutError) as e:
                raise ValueError(f"Failed to generate preview: {str(e)}")
        
        # Build preview data
        preview_data = {
            "module": template.module,
            "category": template.category,
            "topic": template.topic,
            "subtopic": template.subtopic,
            "format": template.format,
            "difficulty": template.difficulty,
            "type": template.type
        }
        
        # Build preview HTML
        preview_html = f"""
        <div class="template-preview">
            <h3>{template.topic} - {template.subtopic}</h3>
            <p><strong>Format:</strong> {template.format}</p>
            <p><strong>Difficulty:</strong> {template.difficulty}</p>
            <p><strong>Type:</strong> {template.type}</p>
        </div>
        """
        
        # Update template
        template.preview_data = preview_data
        template.preview_html = preview_html
        db.commit()
        
        return {
            "preview_samples": samples,
            "preview_data": preview_data,
            "preview_html": preview_html
        }


class QuestionGenerationService:
    """Service for generating questions from templates"""
    
    @staticmethod
    def create_generation_job(
        db: Session,
        job_data: QuestionGenerationJobCreate,
        user_id: int
    ) -> QuestionGenerationJob:
        """Create a new question generation job"""
        
        # Verify template exists and is active
        template = db.query(QuestionTemplate).filter(
            QuestionTemplate.template_id == job_data.template_id,
            QuestionTemplate.status == "active"
        ).first()
        
        if not template:
            raise ValueError("Template not found or not active")
        
        # Create job
        job = QuestionGenerationJob(
            template_id=job_data.template_id,
            requested_count=job_data.requested_count,
            generation_seed=job_data.generation_seed,
            generation_params=job_data.generation_params,
            status="pending",
            created_by_user_id=user_id or 1  # Default to 1 if None (for testing)
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        return job
    
    @staticmethod
    def process_generation_job(db: Session, job_id: int):
        """
        Process a generation job (generate all questions).
        This should be called by a background worker.
        """
        
        job = db.query(QuestionGenerationJob).filter(QuestionGenerationJob.job_id == job_id).first()
        if not job:
            raise ValueError("Job not found")
        
        template = db.query(QuestionTemplate).filter(QuestionTemplate.template_id == job.template_id).first()
        if not template:
            raise ValueError("Template not found")
        
        # Update job status
        job.status = "processing"
        db.commit()
        
        generated_count = 0
        
        try:
            for _ in range(job.requested_count):
                # Execute generator
                result = executor.execute_generator(template.dynamic_question)
                
                # Extract question data based on type
                question_text = result.get('question', '')
                answer_value = str(result.get('answer', ''))
                
                # Build comprehensive variables_used object
                variables_used = {
                    'question_type': result.get('type', template.type),  # 'mcq', 'userInput', etc.
                    'original_variables': result.get('variables', {}),  # Original generation variables
                }
                
                # For MCQ questions, store options
                if 'options' in result:
                    variables_used['options'] = result['options']
                    variables_used['has_options'] = True
                else:
                    variables_used['has_options'] = False
                
                # Store topic if provided
                if 'topic' in result:
                    variables_used['topic'] = result['topic']
                
                # Create hash signature for duplicate detection
                # Include options in hash for MCQ to detect true duplicates
                if variables_used.get('has_options'):
                    hash_input = f"{question_text}{answer_value}{json.dumps(result.get('options', []), sort_keys=True)}"
                else:
                    hash_input = f"{question_text}{answer_value}"
                hash_signature = hashlib.sha256(hash_input.encode()).hexdigest()
                
                # Create generated question
                question = GeneratedQuestion(
                    job_id=job.job_id,
                    template_id=template.template_id,
                    question_html=question_text,
                    answer_value=answer_value,
                    variables_used=variables_used,
                    difficulty_snapshot=template.difficulty,
                    hash_signature=hash_signature
                )
                
                db.add(question)
                generated_count += 1
            
            # Update job
            job.status = "completed"
            job.generated_count = generated_count
            job.completed_at = datetime.utcnow()
            
        except Exception as e:
            job.status = "failed"
            db.commit()
            raise ValueError(f"Job failed: {str(e)}")
        
        db.commit()
    
    @staticmethod
    def get_job(db: Session, job_id: int) -> Optional[QuestionGenerationJob]:
        """Get a generation job by ID"""
        return db.query(QuestionGenerationJob).filter(QuestionGenerationJob.job_id == job_id).first()
    
    @staticmethod
    def list_generated_questions(
        db: Session,
        template_id: Optional[int] = None,
        job_id: Optional[int] = None,
        limit: int = 50,
        offset: int = 0
    ) -> tuple[List[GeneratedQuestion], int]:
        """List generated questions with filtering and pagination"""
        
        query = db.query(GeneratedQuestion)
        
        # Apply filters
        if template_id:
            query = query.filter(GeneratedQuestion.template_id == template_id)
        if job_id:
            query = query.filter(GeneratedQuestion.job_id == job_id)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        questions = query.order_by(GeneratedQuestion.created_at.desc()).offset(offset).limit(limit).all()
        
        return questions, total
    
    @staticmethod
    def get_generated_question(db: Session, question_id: int) -> Optional[GeneratedQuestion]:
        """Get a single generated question by ID"""
        return db.query(GeneratedQuestion).filter(
            GeneratedQuestion.generated_question_id == question_id
        ).first()
