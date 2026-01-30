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

from app.modules.questions import models
from app.modules.questions.models import (
    QuestionTemplate,
    QuestionGenerationJob,
    GeneratedQuestion,
    SyllabusConfig
)
from app.modules.questions.schemas import (
    QuestionTemplateCreate,
    QuestionTemplateUpdate,
    QuestionGenerationJobCreate
)
from app.modules.questions.executor import executor, CodeExecutionError, CodeTimeoutError
from app.modules.auth.models import User


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
        current_user: Optional[User] = None, # Add current_user
        grade_level: Optional[int] = None,
        module: Optional[str] = None,
        category: Optional[str] = None,
        difficulty: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> tuple[List[QuestionTemplate], int]:
        """List templates with filtering and pagination"""
        
        query = db.query(QuestionTemplate)

        # Apply Role-Based Access Control
        # Apply User Isolation (Show only own data)
        if current_user:
            query = query.filter(QuestionTemplate.created_by_user_id == current_user.user_id)
        
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
        else:
            # By default, exclude inactive (deleted) templates
            query = query.filter(QuestionTemplate.status != "inactive")

        if search:
            from sqlalchemy import or_
            search_term = f"%{search}%"
            # Try to match numeric ID or text fields
            search_filters = [
                QuestionTemplate.topic.ilike(search_term),
                QuestionTemplate.subtopic.ilike(search_term),
                QuestionTemplate.module.ilike(search_term),
                QuestionTemplate.category.ilike(search_term)
            ]
            if search.isdigit():
                search_filters.append(QuestionTemplate.template_id == int(search))
            
            query = query.filter(or_(*search_filters))
        
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
    def preview_generation_v2(
        db: Session, 
        question_code: str,
        answer_code: str,
        solution_code: str,
        count: int = 3
    ) -> Dict[str, Any]:
        """
        Generate preview samples for v2 template (sequential python scripts).
        """
        samples = []
        for _ in range(count):
            try:
                # Execute sequentially
                result = executor.execute_sequential([question_code, answer_code, solution_code])
                
                # Format sample
                sample = {
                    "question_html": str(result.get('question', '')),
                    "answer_value": str(result.get('answer', '')),
                    "solution_html": str(result.get('solution', '')),
                    "variables_used": result.get('variables', {})
                }
                
                # Add optional fields
                if 'options' in result:
                    sample['options'] = result['options']
                    sample['question_type'] = result.get('type', 'mcq')
                else:
                    sample['question_type'] = result.get('type', 'user_input')
                
                samples.append(sample)
                
            except (CodeExecutionError, CodeTimeoutError) as e:
                # Don't fail completely if one sample fails, but maybe log it?
                # For preview, it's better to show the error
                raise ValueError(f"Preview failed: {str(e)}")
        
        return {
            "preview_samples": samples,
            # No persistent storage updates for this ephemeral preview
        }

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
            created_by_user_id=None # Default to None to avoid UUID type errors with integer defaults
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
                max_retries = 5
                retry_count = 0
                question = None
                
                while retry_count < max_retries:
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
                    
                    # Check for duplicates
                    existing = db.query(GeneratedQuestion).filter(
                        GeneratedQuestion.template_id == template.template_id,
                        GeneratedQuestion.hash_signature == hash_signature
                    ).first()
                    
                    if not existing:
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
                        break
                    
                    # Duplicate found, retry
                    retry_count += 1
                
                if question:
                    db.add(question)
                    generated_count += 1
            
            # Update job
            job.status = "completed"
            job.generated_count = generated_count
            job.completed_at = datetime.utcnow()
            
        except Exception as e:
            import traceback
            traceback.print_exc()
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
        current_user: Optional[User] = None,
        template_id: Optional[int] = None,
        job_id: Optional[int] = None,
        limit: int = 50,
        offset: int = 0,
        random_order: bool = False
    ) -> tuple[List[GeneratedQuestion], int]:
        """List generated questions with filtering and pagination"""
        
        if current_user:
            query = db.query(GeneratedQuestion).join(QuestionTemplate).filter(QuestionTemplate.created_by_user_id == current_user.user_id)
        else:
            query = db.query(GeneratedQuestion)
        
        # Apply filters
        if template_id:
            query = query.filter(GeneratedQuestion.template_id == template_id)
        if job_id:
            query = query.filter(GeneratedQuestion.job_id == job_id)
        
        # Get total count
        total = query.count()
        
        # Apply pagination and sorting
        if random_order:
            questions = query.order_by(func.random()).offset(offset).limit(limit).all()
        else:
            questions = query.order_by(GeneratedQuestion.created_at.desc()).offset(offset).limit(limit).all()
        
        return questions, total
    
    @staticmethod
    def get_question_stats(db: Session, template_id: Optional[int] = None, current_user: Optional[User] = None) -> List[dict]:
        """
        Get statistics for generated questions, grouped by template.
        """
        query = db.query(
            GeneratedQuestion.template_id,
            func.count(GeneratedQuestion.generated_question_id).label('count')
        )
        
        if current_user:
            query = query.join(QuestionTemplate).filter(QuestionTemplate.created_by_user_id == current_user.user_id)

        if template_id:
            query = query.filter(GeneratedQuestion.template_id == template_id)
            
        return query.group_by(GeneratedQuestion.template_id).all()
    
    @staticmethod
    def get_generated_question(db: Session, question_id: int) -> Optional[GeneratedQuestion]:
        """Get a single generated question by ID"""
        return db.query(GeneratedQuestion).filter(
            GeneratedQuestion.generated_question_id == question_id
        ).first()


class SyllabusService:
    @staticmethod
    def get_config(db: Session, grade_level: int) -> Optional[models.SyllabusConfig]:
        return db.query(models.SyllabusConfig).filter(models.SyllabusConfig.grade_level == grade_level).first()

    @staticmethod
    def save_config(db: Session, grade_level: int, config_data: List[Dict]) -> models.SyllabusConfig:
        existing = SyllabusService.get_config(db, grade_level)
        if existing:
            existing.config = config_data
            db.commit()
            db.refresh(existing)
            return existing
        else:
            new_config = models.SyllabusConfig(grade_level=grade_level, config=config_data)
            db.add(new_config)
            db.commit()
            db.refresh(new_config)
            return new_config

    @staticmethod
    def get_grade_syllabus(db: Session, grade_level: int, current_user: Optional[User] = None) -> Dict[str, Any]:
        """
        Get the complete hierarchical syllabus for a grade.
        Merges saved SyllabusConfig with current active QuestionTemplates.
        """
        # 1. Fetch Config
        config_record = SyllabusService.get_config(db, grade_level)
        
        # 2. Fetch Active Templates (Filtered by User)
        query = db.query(QuestionTemplate).filter(QuestionTemplate.status == "active")
        
        if current_user:
            query = query.filter(QuestionTemplate.created_by_user_id == current_user.user_id)
            
        all_templates = query.all()
        
        grade_templates = []
        for t in all_templates:
            if not t.grade_level:
                continue
            
            # Handle both list (ARRAY) and legacy int
            if isinstance(t.grade_level, list):
                if grade_level in t.grade_level:
                    grade_templates.append(t)
            elif isinstance(t.grade_level, int):
                if t.grade_level == grade_level:
                    grade_templates.append(t)
        
        # Map templates by ID for easy lookup
        template_map = {t.template_id: t for t in grade_templates}
        
        # Helper to convert template to skill node
        def to_skill_node(t: QuestionTemplate):
            topic_code = (t.topic and len(t.topic) > 0 and t.topic[0]) or "X"
            title = t.subtopic or t.topic or "Untitled Skill"
            return {
                "id": t.template_id,
                "code": f"{topic_code}.{t.template_id}", 
                "title": title,
                "type": "skill"
            }
            
        # 3. Build Tree
        if config_record and config_record.config:
            # Use saved config as skeleton
            syllabus_tree = config_record.config
            
            # Recursive function to hydrate skills
            used_template_ids = set()
            
            def hydrate_node(node):
                if "skills" in node:
                    valid_skills = []
                    for skill_ref in node["skills"]:
                        # Handle case where skill_ref might be just an ID or dict
                        tid = skill_ref.get("id") if isinstance(skill_ref, dict) else skill_ref
                        
                        if tid in template_map:
                            t = template_map[tid]
                            hydrated = to_skill_node(t)
                            valid_skills.append(hydrated)
                            used_template_ids.add(tid)
                    node["skills"] = valid_skills
                
                if "children" in node:
                    for child in node["children"]:
                        hydrate_node(child)
            
            # Use deepcopy to avoid modifying ORM object issues
            import copy
            syllabus_tree = copy.deepcopy(syllabus_tree)
            
            for category in syllabus_tree:
                hydrate_node(category)
                
            # Handle Orphans
            orphans = [t for t in grade_templates if t.template_id not in used_template_ids]
            
            if orphans:
                for t in orphans:
                    t_cat = t.category or "Uncategorized"
                    t_top = t.topic or "General"
                    
                    # Try to find matching category
                    cat_node = next((c for c in syllabus_tree if c["name"] == t_cat), None)
                    if not cat_node:
                        cat_node = {
                            "id": f"cat-{t_cat}", 
                            "name": t_cat, 
                            "code": (t_cat[0] if t_cat else "U").upper(),
                            "children": [],
                            "skills": []
                        }
                        syllabus_tree.append(cat_node)
                        
                    # Find matching topic/child
                    topic_node = next((c for c in cat_node.get("children", []) if c["name"] == t_top), None)
                    if not topic_node:
                        topic_node = {
                            "id": f"topic-{t_cat}-{t_top}",
                            "name": t_top,
                            "children": [],
                            "skills": []
                        }
                        if "children" not in cat_node: cat_node["children"] = []
                        cat_node["children"].append(topic_node)
                        
                    if "skills" not in topic_node: topic_node["skills"] = []
                    topic_node["skills"].append(to_skill_node(t))

        else:
            # Default Generation Strategy
            categories = {}
            
            for t in grade_templates:
                cat_name = t.category or "General"
                topic_name = t.topic or "Misc"
                
                if cat_name not in categories:
                    categories[cat_name] = {
                        "id": f"cat-{cat_name}",
                        "name": cat_name,
                        "code": cat_name[0].upper(),
                        "children": [],  # Topics
                        "skills": []     # Direct skills
                    }
                
                cat_node = categories[cat_name]
                topic_node = next((c for c in cat_node["children"] if c["name"] == topic_name), None)
                
                if not topic_node:
                    topic_node = {
                        "id": f"topic-{cat_name}-{topic_name}",
                        "name": topic_name,
                        "children": [],
                        "skills": []
                    }
                    cat_node["children"].append(topic_node)
                    
                topic_node["skills"].append(to_skill_node(t))
            
            syllabus_tree = list(categories.values())
            syllabus_tree.sort(key=lambda x: x["name"])
            for cat in syllabus_tree:
                cat["children"].sort(key=lambda x: x["name"])
        
        return {
            "gradeId": grade_level,
            "gradeName": f"Class {grade_level}",
            "categories": syllabus_tree
        }

