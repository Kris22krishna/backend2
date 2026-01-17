from fastapi import FastAPI, APIRouter
from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.demo.router import router as demo_router
from app.modules.student.router import router as student_router
from app.modules.profile.router import router as profile_router
from app.modules.teacher.router import router as teacher_router
from app.modules.parent.router import router as parent_router
from app.modules.questions.router import router as questions_router
from app.modules.questions.router import generation_router, questions_router as generated_questions_router

app = FastAPI()

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(demo_router)
api_router.include_router(student_router)
api_router.include_router(profile_router)
api_router.include_router(teacher_router)
api_router.include_router(parent_router)
api_router.include_router(questions_router)
api_router.include_router(generation_router)
api_router.include_router(generated_questions_router)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health():
    return {"status": "ok"}
