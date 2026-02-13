from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User
from app.modules.guest.models import Guest
from app.modules.guest.schemas import GuestCreate, GuestResponse

router = APIRouter(prefix="/guests", tags=["guests"])

@router.post("/", response_model=GuestResponse)
def create_guest(
    guest_in: GuestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    guest = Guest(
        guest_id=uuid.uuid4(),
        user_id=guest_in.user_id,
        tenant_id=current_user.tenant_id,
        school_id=current_user.school_id,
        guest_type=guest_in.guest_type,
        purpose=guest_in.purpose,
        access_expires_at=guest_in.access_expires_at
    )
    db.add(guest)
    db.commit()
    db.refresh(guest)
    return guest

@router.get("/{guest_id}", response_model=GuestResponse)
def get_guest(
    guest_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    guest = db.query(Guest).filter(Guest.guest_id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return guest
