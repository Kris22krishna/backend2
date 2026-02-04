from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timedelta
from typing import List, Optional
import uuid

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User, Tenant, School
from app.modules.student.models import Student, Report, TestInvigilationSession
from app.modules.student.schemas import (
    StudentProfile, 
    AssessmentStartRequest, 
    AssessmentSessionResponse, 
    ReportResponse, 
    LogoutResponse
)

router = APIRouter(prefix="/student", tags=["student"])

@router.get("/profile", response_model=StudentProfile)
def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the profile of the currently logged-in student.
    """
    # Verify user is a student? Optional, but good practice.
    if current_user.user_type != 'student':
        # Logic: A user might have multiple roles, but if they logged in as student or 
        # we want to strictly enforce role check:
        pass # Allow for now or enforce logic strictly. 

    student_details = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    
    # Fetch tenant and school names
    tenant = db.query(Tenant).filter(Tenant.tenant_id == current_user.tenant_id).first()
    school = db.query(School).filter(School.school_id == current_user.school_id).first()

    return {
        "user_id": current_user.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "student_id": student_details.student_id if student_details else None,
        "grade": student_details.grade if student_details else None,
        "section": student_details.section if student_details else None,
        "roll_number": student_details.roll_number if student_details else None,
        "tenant_name": tenant.tenant_name if tenant else None,
        "school_name": school.school_name if school else None
    }

@router.get("/stats")
def get_student_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive stats for the current student's dashboard.
    Returns accuracy, streak, XP, skills, weekly activity, and recent activity.
    """
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    
    # Get all reports for this student
    reports = db.query(Report).filter(
        Report.user_id == current_user.user_id
    ).order_by(Report.created_at.desc()).all()
    
    today = datetime.utcnow().date()
    
    # Initialize counters
    total_correct = 0
    total_questions = 0
    total_xp = 0
    activity_dates = set()
    skill_stats = {}
    recent_activity = []
    
    # Weekly activity tracking
    last_7_days = [(today - timedelta(days=i)) for i in range(6, -1, -1)]
    weekly_map = {d: False for d in last_7_days}
    
    for r in reports:
        data = r.report_data or {}
        payload = data.get("parameters", data)
        
        # Stats calculation
        q_count = payload.get("total_questions", 0)
        c_count = payload.get("correct_answers", 0)
        score = payload.get("score", 0)
        
        if q_count == 0 and score > 0:
            q_count = 10
            c_count = int(score / 10)
        
        total_questions += q_count
        total_correct += c_count
        
        # XP: 10 XP per correct answer + 5 bonus for 90%+ score
        xp_earned = c_count * 10
        if q_count > 0 and (c_count / q_count) >= 0.9:
            xp_earned += 50
        total_xp += xp_earned
        
        # Track activity date
        rpt_date = r.created_at.date() if r.created_at else today
        ts_str = payload.get("timestamp")
        if ts_str:
            try:
                rpt_date = datetime.fromisoformat(ts_str.replace("Z", "+00:00")).date()
            except:
                pass
        
        activity_dates.add(rpt_date)
        if rpt_date in weekly_map:
            weekly_map[rpt_date] = True
        
        # Skill tracking
        skill_name = payload.get("skill_name", "General Practice")
        if skill_name not in skill_stats:
            skill_stats[skill_name] = {"score_sum": 0, "count": 0, "scores": []}
        
        skill_stats[skill_name]["score_sum"] += score
        skill_stats[skill_name]["count"] += 1
        skill_stats[skill_name]["scores"].append(score)
        
        # Recent activity (last 5)
        if len(recent_activity) < 5:
            recent_activity.append({
                "title": skill_name,
                "score": score,
                "xp": xp_earned,
                "time": _format_relative_time(r.created_at),
                "total_questions": q_count,
                "correct_answers": c_count
            })
    
    # Calculate accuracy
    accuracy = 0
    if total_questions > 0:
        accuracy = int((total_correct / total_questions) * 100)
    elif reports:
        total_score_sum = sum([s["score_sum"] for s in skill_stats.values()])
        total_count = sum([s["count"] for s in skill_stats.values()])
        if total_count > 0:
            accuracy = int(total_score_sum / total_count)
    
    # Calculate streak
    sorted_dates = sorted(list(activity_dates), reverse=True)
    streak = 0
    
    if sorted_dates:
        if sorted_dates[0] == today:
            streak = 1
            prev_date = today
            for d in sorted_dates[1:]:
                if (prev_date - d).days == 1:
                    streak += 1
                    prev_date = d
                else:
                    break
        elif sorted_dates[0] == (today - timedelta(days=1)):
            streak = 1
            prev_date = sorted_dates[0]
            for d in sorted_dates[1:]:
                if (prev_date - d).days == 1:
                    streak += 1
                    prev_date = d
                else:
                    break
    
    # Weekly activity formatted
    days_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekly_activity = []
    emojis = ["🔥", "⭐", "🎯", "💪", "🚀", "✨", "🌟"]
    for i, d in enumerate(last_7_days):
        weekly_activity.append({
            "day": days_short[d.weekday()],
            "emoji": emojis[i % len(emojis)] if weekly_map[d] else "",
            "active": weekly_map[d]
        })
    
    # Skills categorization
    mastered_skills = []
    in_progress_skills = []
    
    for name, stat in skill_stats.items():
        avg = int(stat["score_sum"] / stat["count"]) if stat["count"] > 0 else 0
        skill_obj = {"name": name, "score": avg}
        
        if avg >= 85:
            mastered_skills.append(skill_obj)
        else:
            in_progress_skills.append(skill_obj)
    
    mastered_skills.sort(key=lambda x: x["score"], reverse=True)
    in_progress_skills.sort(key=lambda x: x["score"], reverse=True)
    
    # Calculate level (1 level per 100 XP)
    level = max(1, total_xp // 100)
    level_progress = total_xp % 100
    
    # Rank based on XP
    rank = "Bronze"
    if total_xp >= 2000:
        rank = "Diamond"
    elif total_xp >= 1000:
        rank = "Gold"
    elif total_xp >= 500:
        rank = "Silver"
    
    return {
        "first_name": current_user.first_name,
        "grade": student.grade if student else None,
        "accuracy": accuracy,
        "streak": streak,
        "total_xp": total_xp,
        "level": level,
        "level_progress": level_progress,
        "rank": rank,
        "questions_today": sum(1 for d in activity_dates if d == today),
        "weekly_activity": weekly_activity,
        "mastered_skills": mastered_skills[:5],
        "in_progress_skills": in_progress_skills[:5],
        "recent_activity": recent_activity,
        "total_questions": total_questions,
        "total_reports": len(reports)
    }

def _format_relative_time(dt: Optional[datetime]) -> str:
    """Format datetime as relative time string."""
    if not dt:
        return "Unknown"
    
    now = datetime.utcnow()
    diff = now - dt
    
    if diff.days == 0:
        hours = diff.seconds // 3600
        if hours == 0:
            mins = diff.seconds // 60
            return f"{mins} min ago" if mins > 0 else "Just now"
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.days == 1:
        return "Yesterday"
    else:
        return f"{diff.days} days ago"


@router.post("/assessment/start", response_model=AssessmentSessionResponse)
def start_assessment(
    request: AssessmentStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start a new assessment session.
    """
    # Create an invigilation session record
    new_session = TestInvigilationSession(
        tenant_id=current_user.tenant_id,
        school_id=current_user.school_id,
        companion_user_id=current_user.user_id, # Using matching user field for now
        start_time=datetime.utcnow(),
        # test_session_id could be linked to request.test_id
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    return {
        "invigilation_id": new_session.invigilation_id,
        "start_time": new_session.start_time,
        "status": "started"
    }

@router.get("/reports", response_model=List[ReportResponse])
def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get list of reports for the current student.
    """
    reports = db.query(Report).filter(
        Report.user_id == current_user.user_id
    ).order_by(desc(Report.created_at)).all()
    
    return reports

@router.post("/logout", response_model=LogoutResponse)
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout API. Client should discard the token.
    """
    return {"message": "Successfully logged out"}

