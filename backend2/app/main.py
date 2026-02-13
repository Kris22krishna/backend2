from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Fix ModuleNotFoundError: Add parent directory (backend2) to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.demo.router import router as demo_router
from app.modules.assessment_integration.router import router as assessment_integration_router
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
from app.modules.skills.router import router as skills_router
from app.modules.practice.router import router as practice_router
from app.modules.mentor.router import router as mentor_router

from fastapi.staticfiles import StaticFiles
from app.modules.upload.router import router as upload_router


app = FastAPI(
    swagger_ui_parameters={
        "persistAuthorization": True,
    }
)

# Use absolute path for static files to avoid CWD issues
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.add_middleware(
    CORSMiddleware,
    # Explicit origins required for allow_credentials=True
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://www.skill100.ai",
        "https://skill100.ai",
        "https://backend2-red.vercel.app",
        "https://backend2-krishnas-projects-c104e4ff.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Force redeployment for CORS updates

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
api_router.include_router(assessment_integration_router)
api_router.include_router(assessment_integration_router)
api_router.include_router(practice_router)
api_router.include_router(mentor_router)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health():
    # Health check endpoint - force reload
    return {"status": "ok"}
