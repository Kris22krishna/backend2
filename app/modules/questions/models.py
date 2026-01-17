from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class QuestionTemplate(Base):
    """
    Store question templates created by interns.
    Templates contain Python code that generates dynamic questions.
    """
    __tablename__ = "question_templates"
    
    template_id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Categorization
    module = Column(String, nullable=False, index=True)           # "Math Skill"
    category = Column(String, nullable=False, index=True)         # "Fundamentals"
    topic = Column(String, nullable=False)                        # "Addition"
    subtopic = Column(String, nullable=False)                     # "Addition of 2 numbers"
    
    # Question Configuration
    format = Column(String, nullable=False)                       # "format1: 22+22", "format2: word problem"
    difficulty = Column(String, nullable=False, index=True)       # "easy", "medium", "hard" or range "1-20"
    type = Column(String, nullable=False)                         # "mcq", "user_input", "image_based", "code_based"
    
    # Code & Logic
    dynamic_question = Column(Text, nullable=False)               # Python code to generate question
    logical_answer = Column(Text, nullable=False)                 # Python code to validate answer
    
    # Preview Data
    preview_data = Column(JSON, nullable=True)                    # Stores template metadata for preview
    preview_html = Column(Text, nullable=True)                    # Rendered HTML preview
    
    # Metadata
    status = Column(String, default="draft", index=True)          # "draft", "active", "inactive"
    created_by_user_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # UUID to match User model
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    generation_jobs = relationship("QuestionGenerationJob", back_populates="template")
    generated_questions = relationship("GeneratedQuestion", back_populates="template")


class QuestionGenerationJob(Base):
    """
    Track batch question generation requests.
    Acts as an audit log for all generation activities.
    """
    __tablename__ = "question_generation_jobs"
    
    job_id = Column(Integer, primary_key=True, autoincrement=True)
    template_id = Column(Integer, ForeignKey("question_templates.template_id"), nullable=False, index=True)
    
    # Generation Parameters
    requested_count = Column(Integer, nullable=False)             # How many questions requested
    generated_count = Column(Integer, default=0)                  # How many actually generated
    generation_seed = Column(String, nullable=True)               # Random seed for reproducibility
    generation_params = Column(JSON, nullable=True)               # Additional params (difficulty override, etc.)
    
    # Status Tracking
    status = Column(String, default="pending", index=True)        # "pending", "processing", "completed", "failed"
    created_by_user_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # UUID to match User model
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    template = relationship("QuestionTemplate", back_populates="generation_jobs")
    generated_questions = relationship("GeneratedQuestion", back_populates="job")


class GeneratedQuestion(Base):
    """
    Store actual generated questions for student tests.
    Each record is a unique question instance.
    """
    __tablename__ = "generated_questions"
    
    generated_question_id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("question_generation_jobs.job_id"), nullable=False, index=True)
    template_id = Column(Integer, ForeignKey("question_templates.template_id"), nullable=False, index=True)
    
    # Question Content
    question_html = Column(Text, nullable=False)                  # Rendered HTML question
    answer_value = Column(String, nullable=False)                 # Correct answer
    variables_used = Column(JSON, nullable=True)                  # Variables used in generation (for debugging)
    
    # Metadata
    difficulty_snapshot = Column(String, nullable=True)           # Difficulty at generation time
    hash_signature = Column(String, nullable=True, index=True)    # Hash to detect duplicates
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    job = relationship("QuestionGenerationJob", back_populates="generated_questions")
    template = relationship("QuestionTemplate", back_populates="generated_questions")
