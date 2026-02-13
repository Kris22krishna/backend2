from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID

class ReportCreate(BaseModel):
    uid: str # User ID (string because it might befirebase ID or uuid string)
    childId: Optional[str] = None
    category: Optional[str] = None
    reportData: Dict[str, Any]

class ReportResponse(BaseModel):
    success: bool
    report_id: Optional[str]
    message: Optional[str]

class ReportListResponse(BaseModel):
    success: bool
    data: list
    message: Optional[str] = None
