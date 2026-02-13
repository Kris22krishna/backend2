from sqlalchemy import Column, String, Integer, Text
from app.db.base import Base


class Skill(Base):
    """
    Store predefined skills that can be linked to question templates.
    """
    __tablename__ = "skills"
    
    skill_id = Column(Integer, primary_key=True, autoincrement=True)
    grade = Column(Integer, nullable=False, index=True)
    topic = Column(Text, nullable=False)  # Category/Topic name
    sub_topic = Column(Text, nullable=True) # Nested Sub-category
    skill_name = Column(Text, nullable=False)
