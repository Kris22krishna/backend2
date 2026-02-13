from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class LotteryRegister(BaseModel):
    firstName: str
    email: Optional[EmailStr] = None
    phoneNumber: Optional[str] = None
    grade: Optional[str] = None
    schoolName: Optional[str] = None
    profession: Optional[str] = None
    referenceSource: Optional[str] = None
    ticketCode: Optional[str] = None # Or generated backend side if not provided
    user_id: Optional[UUID] = None

class LotteryResponse(BaseModel):
    registration_id: UUID
    ticket_code: str
    message: str
