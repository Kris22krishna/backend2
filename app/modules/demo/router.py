from fastapi import APIRouter, Depends
from app.core.context import RequestContext
from app.core.dependencies import get_context

router = APIRouter(prefix="/demo", tags=["demo"])

@router.get("/me")
def who_am_i(ctx: RequestContext = Depends(get_context)):
    return {
        "user_id": ctx.user_id,
        "tenant_id": ctx.tenant_id
    }

@router.get("/hello")
def hello(ctx: RequestContext = Depends(get_context)):
    return f"Hello user {ctx.user_id} from tenant {ctx.tenant_id}"
