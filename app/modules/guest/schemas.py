from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class GuestCreate(BaseModel):
    user_id: UUID
    guest_type: Optional[str] = None
    purpose: Optional[str] = None
    access_expires_at: Optional[datetime] = None

class GuestResponse(BaseModel):
    guest_id: UUID
    user_id: UUID
    guest_type: Optional[str]
    access_expires_at: Optional[datetime]

    class Config:
        orm_mode = True
