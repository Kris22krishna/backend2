from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.db.session import get_db
from app.core.security import get_current_user
from app.modules.auth.models import User, School
from app.modules.student.models import Student, Report
from app.modules.parent.models import Parent, ParentStudent
from app.modules.parent.schemas import (
    ParentProfile, 
    ChildDetail, 
    ReportSummary, 
    LogoutResponse,
    LinkChildRequest,
    LinkChildResponse,
    ChildStatsResponse,
    SkillStat,
    ChildProgressResponse,
    ChildQuizzesResponse,
    ChildSkillsResponse,
    ChildReportSummaryResponse,
    WeekStat,
    Milestone,
    QuizResult,
    DailyActivity,
    SkillGroupSummary
)
import random
from datetime import datetime, timedelta

# ... imports ...


from fastapi import HTTPException, status
import uuid

router = APIRouter(prefix="/parent", tags=["parent"])

@router.get("/profile", response_model=ParentProfile)
def get_parent_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current parent profile.
    """
    parent_details = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    
    return {
        "user_id": current_user.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "parent_id": parent_details.parent_id if parent_details else None,
        "occupation": parent_details.occupation if parent_details else None,
    }

@router.get("/children", response_model=List[ChildDetail])
def get_children(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List linked children.
    """
    parent_details = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    if not parent_details:
        return []
        
    links = db.query(ParentStudent).filter(ParentStudent.parent_id == parent_details.parent_id).all()
    
    result = []
    for link in links:
        student = db.query(Student).filter(Student.student_id == link.student_id).first()
        if student:
            user = db.query(User).filter(User.user_id == student.user_id).first()
            school = db.query(School).filter(School.school_id == student.school_id).first()
            if user:
                result.append({
                    "student_id": student.student_id,
                    "name": f"{user.first_name} {user.last_name or ''}".strip(),
                    "grade": student.grade,
                    "school_name": school.school_name if school else None,
                    "role_number": student.roll_number
                })
    return result


@router.get("/reports", response_model=List[ReportSummary])
def get_child_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List reports for all linked children.
    """
    parent_details = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    if not parent_details:
        return []

    # Get all student IDs linked to parent
    links = db.query(ParentStudent).filter(ParentStudent.parent_id == parent_details.parent_id).all()
    student_ids = [link.student_id for link in links] # These are Student table IDs
    
    # We need to map Student ID -> User ID because Reports linked to User ID typically
    students = db.query(Student).filter(Student.student_id.in_(student_ids)).all()
    student_user_ids = [s.user_id for s in students]
    
    reports = db.query(Report, User).join(User, Report.user_id == User.user_id).filter(
        Report.user_id.in_(student_user_ids)
    ).order_by(desc(Report.created_at)).all()
    
    result = []
    for report, user_t in reports:
        result.append({
            "report_id": report.report_id,
            "student_name": f"{user_t.first_name} {user_t.last_name or ''}".strip(),
            "report_type": report.report_type,
            "status": report.status,
            "status": report.status,
            "generated_at": report.created_at,
            "file_url": report.report_data.get("file_url") if report.report_data else None
        })
    return result

@router.post("/logout", response_model=LogoutResponse)
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

@router.post("/link-child", response_model=LinkChildResponse)
def link_child(
    request: LinkChildRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Link a student to the current parent account using student's username.
    """
    # 1. Get Parent Profile
    parent = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    if not parent:
        # Create parent profile if not exists (lazy creation)
        parent = Parent(
            user_id=current_user.user_id,
            parent_id=uuid.uuid4(),
            tenant_id=current_user.tenant_id, # Assuming tenant context
            school_id=current_user.school_id, # Include school_id
            occupation="Parent"
        )
        db.add(parent)
        db.commit()
        db.refresh(parent)

    # 2. Find Student User by Username
    # 2. Find Student User by Identifier (Credential)
    # Check Credentials table since User doesn't have username field
    from app.modules.auth.models import Credential
    
    credential = db.query(Credential).filter(Credential.identifier == request.student_username).first()
    
    if not credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found with this username/email"
        )
        
    student_user = db.query(User).filter(User.user_id == credential.user_id).first()
    if not student_user:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    
    # 3. Get Student Profile
    student = db.query(Student).filter(Student.user_id == student_user.user_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not registered as a student"
        )

    # 4. Check if already linked
    existing_link = db.query(ParentStudent).filter(
        ParentStudent.parent_id == parent.parent_id,
        ParentStudent.student_id == student.student_id
    ).first()

    if existing_link:
        return {
            "message": "Student already linked",
            "student_name": f"{student_user.first_name} {student_user.last_name}",
            "student_id": student.student_id
        }

    # 5. Create Link
    new_link = ParentStudent(
        parent_student_id=uuid.uuid4(),
        parent_id=parent.parent_id,
        student_id=student.student_id,
        relationship_type="Parent",
        can_view_reports=True,
        can_receive_notifications=True
    )
    db.add(new_link)
    db.commit()

    return {
        "message": "Successfully linked student",
        "student_name": f"{student_user.first_name} {student_user.last_name}",
        "student_id": student.student_id
    }

@router.get("/stats/{student_id}", response_model=ChildStatsResponse)
def get_student_stats(
    student_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get dynamic stats for a linked child.
    """
    # Verify link exists
    parent = db.query(Parent).filter(Parent.user_id == current_user.user_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent profile not found")

    link = db.query(ParentStudent).filter(
        ParentStudent.parent_id == parent.parent_id,
        ParentStudent.student_id == student_id
    ).first()

    if not link:
         raise HTTPException(status_code=403, detail="Not authorized to view this student")

    # Fetch Reports to calculate real accuracy
    # We need to find the user_id for the student_id first
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
         raise HTTPException(status_code=404, detail="Student not found")

    # Real Calculation Logic
    
    # Get all reports for this student user
    student_user_id = student.user_id
    reports = db.query(Report).filter(Report.user_id == student_user_id).order_by(Report.created_at.asc()).all()
    
    # 1. Accuracy & Total Questions
    total_correct = 0
    total_questions = 0
    
    # 2. Streak Logic (Consecutive days with activity)
    activity_dates = set()
    
    # 3. Skills Analysis
    skill_stats = {} # { skill_name: { score_sum: 0, count: 0, trend: [] } }
    
    # 4. Weekly Activity
    today = datetime.utcnow().date()
    last_7_days = [(today - timedelta(days=i)) for i in range(6, -1, -1)]
    weekly_map = {d: False for d in last_7_days}

    for r in reports:
        data = r.report_data or {}
        # Parse based on structure used in PracticeSession:
        # { "score": 85, "total_questions": 10, "correct_answers": 8, "skill_name": "...", "timestamp": "...", "type": "Practice" }
        
        # Determine payload
        payload = data.get("parameters", data) # Flattening if needed
        
        # Stats
        q_count = payload.get("total_questions", 0)
        c_count = payload.get("correct_answers", 0)
        
        # If score is present but counts missing (legacy?), imply counts
        score = payload.get("score", 0)
        if q_count == 0 and score > 0:
            q_count = 10 # Estimate
            c_count = int(score / 10)
            
        total_questions += q_count
        total_correct += c_count
        
        # Date
        ts_str = payload.get("timestamp")
        rpt_date = r.created_at.date() if r.created_at else today
        if ts_str:
            try:
                rpt_date = datetime.fromisoformat(ts_str.replace("Z", "+00:00")).date()
            except:
                pass
                
        activity_dates.add(rpt_date)
        if rpt_date in weekly_map:
            weekly_map[rpt_date] = True
            
        # Skill
        skill_name = payload.get("skill_name", "General Practice")
        if skill_name not in skill_stats:
            skill_stats[skill_name] = {"score_sum": 0, "count": 0, "scores": []}
        
        skill_stats[skill_name]["score_sum"] += score
        skill_stats[skill_name]["count"] += 1
        skill_stats[skill_name]["scores"].append(score)

    # Final Accuracy
    accuracy = 0
    if total_questions > 0:
        accuracy = int((total_correct / total_questions) * 100)
    elif reports: 
        # Fallback if counts missing but scores exist
        avg_score = sum([s["score_sum"] for s in skill_stats.values()]) / max(sum([s["count"] for s in skill_stats.values()]), 1)
        accuracy = int(avg_score)

    # Streak Calculation
    sorted_dates = sorted(list(activity_dates), reverse=True)
    streak = 0
    current_check = today
    
    # Check if active today
    if sorted_dates and sorted_dates[0] == today:
        streak = 1
        current_check = today - timedelta(days=1)
        idx = 1
    elif sorted_dates and sorted_dates[0] == (today - timedelta(days=1)):
        # Active yesterday means streak is alive
        streak = 1
        current_check = today - timedelta(days=2)
        idx = 1
    else:
        streak = 0
        idx = 0
        
    if streak > 0:
         # Count backwards
         # Simply iterating sorted_dates descending
         # We already handled the first match (today or yesterday)
         # Now check continuity
         prev_date = sorted_dates[0]
         for d in sorted_dates[1:]:
             if (prev_date - d).days == 1:
                 streak += 1
                 prev_date = d
             else:
                 break

    # Weekly Activity Formatted
    weekly_activity = []
    days_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    # We want last 7 days usually ending today
    # But UI seems to want Mo-Su? Or just 7 days? 
    # Let's give last 7 days ending today for relevant context
    for d in last_7_days:
        weekly_activity.append({
            "day": days_short[d.weekday()],
            "emoji": "🔥" if weekly_map[d] else "",
            "active": weekly_map[d]
        })

    # Skills Lists
    strengths_list = []
    mastered_list = []
    growing_list = []
    
    for name, stat in skill_stats.items():
        avg = int(stat["score_sum"] / stat["count"])
        
        # Trend
        scores = stat["scores"]
        trend = "stable"
        if len(scores) >= 2:
            if scores[-1] > scores[0]: trend = "up"
            elif scores[-1] < scores[0]: trend = "down"
            
        s_obj = SkillStat(name=name, score=avg, trend=trend)
        
        if avg >= 90:
            mastered_list.append(s_obj)
            strengths_list.append(s_obj)
        elif avg >= 75:
            strengths_list.append(s_obj)
        elif avg < 75:
            growing_list.append(s_obj)
            
    # Sort strengths by score desc
    strengths_list.sort(key=lambda x: x.score, reverse=True)
    mastered_list.sort(key=lambda x: x.score, reverse=True)
    growing_list.sort(key=lambda x: x.score) # lowest first

    return {
        "accuracy": accuracy,
        "streak": streak,
        "weekly_activity": weekly_activity,
        "strengths": strengths_list[:3],
        "mastered_skills": mastered_list,
        "growing_skills": growing_list
    }

# --- Dynamic Sub-page Endpoints ---

@router.get("/progress/{student_id}", response_model=ChildProgressResponse)
def get_student_progress(
    student_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = get_student_stats(student_id, current_user, db)
    
    # Calculate Weekly Progress (Mocking historical trend for now based on current accuracy)
    # Ideally we'd group reports by week.
    current_acc = stats["accuracy"]
    weekly_progress = []
    for i in range(4):
        # Simulate slight improvement
        mock_acc = max(0, min(100, current_acc - (3-i)*2 + random.randint(-2, 2)))
        weekly_progress.append(WeekStat(week=f"Week {i+1}", accuracy=mock_acc))
        
    # Milestones (Mock for now, easy to make real later)
    milestones = [
        Milestone(emoji="🎯", title="First 100 Questions!", date="Jan 15", color="bg-blue-100 text-blue-700"),
        Milestone(emoji="🔥", title=f"{stats['streak']}-Day Streak", date=datetime.utcnow().strftime("%b %d"), color="bg-orange-100 text-orange-700"),
        Milestone(emoji="🏆", title="First 90%+ Quiz Score", date="Feb 1", color="bg-yellow-100 text-yellow-700"),
    ]

    return {
        "improvement_pct": 10, # Mock
        "streak": stats["streak"],
        "current_accuracy": current_acc,
        "total_points": 156, # Mock
        "weekly_progress": weekly_progress,
        "milestones": milestones
    }

@router.get("/quizzes/{student_id}", response_model=ChildQuizzesResponse)
def get_student_quizzes(
    student_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify link exists (Reuse logic or refactor into dependency)
    # For speed, trusting get_student_stats check logic or assuming valid if stats call succeeds?
    # Better to duplicate check or make helper.
    
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student: raise HTTPException(404, "Student not found")
    
    student_user_id = student.user_id
    reports = db.query(Report).filter(Report.user_id == student_user_id).order_by(Report.created_at.desc()).limit(10).all()
    
    stats = get_student_stats(student_id, current_user, db)
    
    recent_quizzes = []
    total_score = 0
    for r in reports:
        data = r.report_data.get("parameters", r.report_data)
        score = data.get("score", 0)
        name = data.get("skill_name", r.report_type)
        date_str = r.created_at.strftime("%b %d")
        
        badge = "Good Job"
        color = "bg-blue-100 text-blue-700"
        if score >= 90:
             badge = "Excellent!"
             color = "bg-green-100 text-green-700"
        elif score < 60:
             badge = "Keep Going"
             color = "bg-yellow-100 text-yellow-700"
             
        recent_quizzes.append(QuizResult(
            id=str(r.report_id),
            name=name,
            score=score,
            date=date_str,
            badge=badge,
            color=color
        ))
        total_score += score

    avg_score = int(total_score / len(reports)) if reports else 0

    return {
        "total_quizzes": len(reports), # Should be count(*) really
        "avg_score": avg_score,
        "streak": stats["streak"],
        "avg_time_mins": 8, # Mock
        "weekly_activity": [DailyActivity(day=w["day"], active=w["active"], count=random.randint(1,5) if w["active"] else 0) for w in stats["weekly_activity"]],
        "recent_quizzes": recent_quizzes
    }

@router.get("/skills/{student_id}", response_model=ChildSkillsResponse)
def get_student_skills_detail(
    student_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = get_student_stats(student_id, current_user, db)
    
    mastered = stats["mastered_skills"]
    growing = stats["growing_skills"] # < 75
    # Let's split growing into "Improving" (50-75) and "Need Practice" (<50)
    
    improving = []
    need_practice = []
    
    for s in growing:
        if s.score >= 50:
            improving.append(s)
        else:
            need_practice.append(s)
            
    return {
        "summary": {
            "mastered_count": len(mastered),
            "improving_count": len(improving),
            "need_practice_count": len(need_practice)
        },
        "mastered_skills": mastered,
        "growing_skills": improving,
        "need_practice_skills": need_practice
    }

@router.get("/reports-summary/{student_id}", response_model=ChildReportSummaryResponse)
def get_student_report_summary(
    student_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = get_student_stats(student_id, current_user, db)
    
    # Needs top performers and weakest
    all_skills = stats["mastered_skills"] + stats["strengths"] + stats["growing_skills"]
    # Deduplicate by name
    unique_skills = {}
    for s in all_skills:
        unique_skills[s.name] = s
        
    sorted_skills = sorted(unique_skills.values(), key=lambda x: x.score, reverse=True)
    
    return {
        "period": datetime.utcnow().strftime("%B %Y"),
        "total_quizzes": 24, # Mock or count
        "avg_accuracy": stats["accuracy"],
        "improvement": 10,
        "streak": stats["streak"],
        "skills_mastered": len(stats["mastered_skills"]),
        "top_performances": sorted_skills[:3],
        "areas_to_improve": sorted_skills[-3:] if len(sorted_skills) > 3 else []
    }
