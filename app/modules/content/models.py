from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base


class Grade(Base):
    """
    Represents a grade level (e.g., Class 1, Class 2, etc.)
    """
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)  # e.g., "Class 1"
    display_order = Column(Integer, nullable=False, default=0, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    categories = relationship("Category", back_populates="grade", cascade="all, delete-orphan")


class Category(Base):
    """
    Represents a category or subcategory in the curriculum hierarchy.
    Self-referencing to support unlimited nesting depth.
    """
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    grade_id = Column(Integer, ForeignKey("grades.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=True, index=True)
    code = Column(String(10), nullable=True)  # e.g., "A", "B", "C"
    name = Column(String(200), nullable=False)  # e.g., "Numbers and comparing"
    display_order = Column(Integer, nullable=False, default=0, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    grade = relationship("Grade", back_populates="categories")
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="category", cascade="all, delete-orphan")


class Skill(Base):
    """
    Represents a specific skill within a category.
    Skills can be attached to any category level.
    """
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(20), nullable=False)  # e.g., "A.1", "B.2.1"
    title = Column(String(500), nullable=False)  # e.g., "Even or odd"
    display_order = Column(Integer, nullable=False, default=0, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="skills")
