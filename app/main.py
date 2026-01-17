from fastapi import FastAPI, APIRouter
from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.demo.router import router as demo_router

app = FastAPI()

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(demo_router)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health():
    return {"status": "ok"}
