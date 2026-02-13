from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.lottery.models import LotteryRegistration
from app.modules.lottery.schemas import LotteryRegister, LotteryResponse
import uuid

router = APIRouter(prefix="/lottery", tags=["lottery"])

@router.post("/register", response_model=LotteryResponse)
def register_lottery(
    payload: LotteryRegister,
    db: Session = Depends(get_db)
):
    # Check for existing ticket if needed, or just create new
    # For now, just create a new record
    
    # If ticket code is not provided, generate one (basic)
    ticket_code = payload.ticketCode or str(uuid.uuid4())[:8].upper()
    
    new_reg = LotteryRegistration(
        ticket_code=ticket_code,
        first_name=payload.firstName,
        email=payload.email,
        phone_number=payload.phoneNumber,
        grade=payload.grade,
        school_name=payload.schoolName,
        profession=payload.profession,
        reference_source=payload.referenceSource,
        user_id=payload.user_id
    )
    
    db.add(new_reg)
    try:
        db.commit()
        db.refresh(new_reg)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return {
        "registration_id": new_reg.registration_id,
        "ticket_code": new_reg.ticket_code,
        "message": "Lottery registration successful"
    }
