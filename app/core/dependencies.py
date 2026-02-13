from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.core.security import decode_token
from app.core.context import RequestContext

security = HTTPBearer()

def get_context(token=Depends(security)) -> RequestContext:
    payload = decode_token(token.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return RequestContext(
        user_id=payload["sub"],
        tenant_id=payload["tenant_id"],
    )
