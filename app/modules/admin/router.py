from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User
from app.modules.admin.models import AuditLog
from app.modules.admin.schemas import AuditLogResponse

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, restrict this to admin users
    logs = db.query(AuditLog).filter(AuditLog.tenant_id == current_user.tenant_id).limit(100).all()
    return logs
