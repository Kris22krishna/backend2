from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.demo.router import router as demo_router
from app.modules.student.router import router as student_router
from app.modules.profile.router import router as profile_router
from app.modules.teacher.router import router as teacher_router
from app.modules.parent.router import router as parent_router
from app.modules.questions.router import router as questions_router
from app.modules.questions.router import generation_router, questions_router as generated_questions_router
from app.modules.questions.router import new_templates_router
from app.modules.mentorship.router import router as mentorship_router
from app.modules.guest.router import router as guest_router
from app.modules.admin.router import router as admin_router
from app.modules.lottery.router import router as lottery_router
from app.modules.puzzles.router import router as puzzles_router
from app.modules.reports.router import router as reports_router
from app.modules.admin.dashboard_router import router as dashboard_router
from app.modules.skills.router import router as skills_router

from fastapi.staticfiles import StaticFiles
from app.modules.upload.router import router as upload_router

app = FastAPI(
    swagger_ui_parameters={
        "persistAuthorization": True,
    }
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter()
api_router.include_router(upload_router, tags=["upload"])
api_router.include_router(auth_router)
api_router.include_router(demo_router)
api_router.include_router(student_router)
api_router.include_router(profile_router)
api_router.include_router(teacher_router)
api_router.include_router(parent_router)
api_router.include_router(questions_router)
api_router.include_router(generation_router)
api_router.include_router(generated_questions_router)
api_router.include_router(mentorship_router)
api_router.include_router(guest_router)
api_router.include_router(admin_router)
api_router.include_router(lottery_router)
api_router.include_router(puzzles_router)
api_router.include_router(reports_router)
api_router.include_router(dashboard_router)  # Has /admin prefix built-in
api_router.include_router(skills_router)
api_router.include_router(new_templates_router)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health():
    # Health check endpoint - force reload
    return {"status": "ok"}
