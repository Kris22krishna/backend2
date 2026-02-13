from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User, V2User, V2Student, V2Mentorship, V2AuthCredential
from app.modules.mentor.schemas import MentorProfile, MentorStudentSummary, MentorStudentsResponse, MentorStatsResponse

router = APIRouter(prefix="/mentor", tags=["mentor"])



@router.get("/profile", response_model=MentorProfile)
def get_mentor_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current mentor profile (V2).
    """
    # Assuming V2 User structure where current_user.user_id maps to V2User.user_id
    v2_user = db.query(V2User).filter(V2User.user_id == current_user.user_id).first()
    
    if not v2_user:
        # Fallback to V1 User if not found in V2 (though should be V2)
        return {
            "user_id": current_user.user_id,
            "name": f"{current_user.first_name} {current_user.last_name or ''}".strip(),
            "email": current_user.email,
            "phone_number": current_user.phone_number,
            "role": current_user.user_type # or 'mentor'
        }

    # Get email and phone from V2AuthCredential or V2Mentors (if exists)
    cred = db.query(V2AuthCredential).filter(V2AuthCredential.user_id == v2_user.user_id).first()
    
    # We might need to join V2Mentors for phone if strictly following schema,
    # but V2User only has name and role. 
    # Let's assume basic details from Auth + User for now. 
    
    return {
        "user_id": v2_user.user_id,
        "name": v2_user.name,
        "email": cred.email_id if cred else None,
        "phone_number": None, # or fetch from V2Mentors if needed
        "role": v2_user.role
    }

@router.get("/students", response_model=List[MentorStudentSummary])
def get_mentor_students(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get students assigned to the current mentor.
    """
    # Find students linked via V2Mentorship
    mentorships = db.query(V2Mentorship).filter(
        V2Mentorship.mentor_id == current_user.user_id
    ).all()
    
    student_ids = [m.student_id for m in mentorships]
    
    if not student_ids:
        return []

    # Fetch student details
    students = db.query(V2Student, V2User, V2AuthCredential).join(
        V2User, V2Student.user_id == V2User.user_id
    ).outerjoin(
        V2AuthCredential, V2Student.user_id == V2AuthCredential.user_id
    ).filter(
        V2Student.user_id.in_(student_ids)
    ).all()
    
    result = []
    for stud, usr, cred in students:
        result.append({
            "user_id": usr.user_id,
            "student_id": stud.user_id, # using user_id as student_id for V2
            "name": usr.name,
            "email": cred.email_id if cred else None,
            "grade": stud.class_name if hasattr(stud, 'class_name') else getattr(stud, 'class', None), 
             # Note: logic for 'class' vs 'class_name' field in V2Student model 
             # Schema says 'class', code in auth router used 'class_name'. Checking model definition desirable.
             # Assuming 'class_name' based on previous context, but fallback to 'class'.
            "section": None,
            "roll_number": None
        })
        
    return result

@router.get("/stats", response_model=MentorStatsResponse)
def get_mentor_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get aggregated stats for the mentor's students, including day-wise breakdown.
    """
    # 1. Get all students assigned to mentor robustly
    all_mentorships = db.query(V2Mentorship).all()
    # Filter in Python to handle potential int/str/UUID mismatches
    mentorships = [m for m in all_mentorships if str(m.mentor_id) == str(current_user.user_id)]
    
    student_ids = [m.student_id for m in mentorships]
    total_students = len(student_ids)
    
    if total_students == 0:
        return {
            "total_students": 0,
            "total_time_seconds": 0,
            "avg_time_seconds": 0,
            "daily_stats": []
        }

    # 2. Daily Stats from V2PracticeSessions
    from app.modules.practice.models import PracticeSession as V2PracticeSession
    from sqlalchemy import func, cast, Date
    from datetime import date

    # Group by date for Time and Questions Solved (Total Correct)
    daily_query = db.query(
        cast(V2PracticeSession.started_at, Date).label('date'),
        func.sum(V2PracticeSession.total_time_seconds).label('total_time'),
        func.sum(V2PracticeSession.total_questions).label('total_solved')
    ).filter(
        V2PracticeSession.user_id.in_(student_ids)
    ).group_by(
        cast(V2PracticeSession.started_at, Date)
    ).order_by(
        cast(V2PracticeSession.started_at, Date).asc()
    ).all()

    daily_stats = []
    
    # Vars for "Today's" stats
    today_str = str(date.today())
    today_total_time = 0
    today_questions_solved = 0
    
    for d in daily_query:
        day_date_str = str(d.date)
        day_total_time = d.total_time or 0
        day_total_solved = d.total_solved or 0
        
        # Check if this row is for today
        if day_date_str == today_str:
            today_total_time = day_total_time
            today_questions_solved = day_total_solved

        daily_stats.append({
            "date": day_date_str,
            "total_time_seconds": day_total_time,
            "avg_time_seconds": int(day_total_time / total_students) if total_students > 0 else 0,
            "total_solved": day_total_solved
        })

    # Calculate Avg for Today
    today_avg_time = int(today_total_time / total_students) if total_students > 0 else 0
    
    return {
        "total_students": total_students,
        "total_time_seconds": today_total_time,
        "avg_time_seconds": today_avg_time,
        "today_questions_solved": today_questions_solved,
        "daily_stats": daily_stats
    }
