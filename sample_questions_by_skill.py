
import sys
import os
import asyncio
import json
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.modules.questions.models import QuestionGeneration
from app.modules.questions.service import QuestionGenerationService

async def sample_questions(skill_id):
    db = SessionLocal()
    try:
        # Fetch templates for this skill
        templates = db.query(QuestionGeneration).filter(
            QuestionGeneration.skill_id == skill_id
        ).all()
        
        if not templates:
            print(f"No templates found for skill ID {skill_id}")
            return

        print(f"Sampling questions for Skill ID {skill_id} ({templates[0].skill_name})")
        
        for t in templates:
            print(f"\nTemplate ID {t.template_id} (Format {t.format}, Type {t.type}, Skill Name in Template: {t.skill_name})")
            # Generate 3 samples
            # Note: preview_generation_v2 returns a DICT with samples in a key, based on service logic
            # Actually, looking at service.py, it returns a LIST of samples (wait, let me re-check)
            # Re-checking service.py:
            # 260:     ) -> Dict[str, Any]:
            # It seems it returns a DICT.
            
            result = QuestionGenerationService.preview_generation_v2(
                db,
                t.question_template,
                t.answer_template,
                t.solution_template,
                count=3
            )
            
            # Re-check the result structure from service.py
            # wait, I should check the end of the function in service.py
            samples = result if isinstance(result, list) else result.get('preview_samples', result)
            
            if isinstance(samples, dict) and 'samples' in samples:
                samples = samples['samples']

            for i, s in enumerate(samples[:3]):
                q_text = s.get('question_html', s.get('question_text', 'N/A'))
                print(f"  {i+1}. Q: {q_text[:100]}")
                print(f"     A: {s.get('answer_value', 'N/A')}")
                if 'options' in s:
                    print(f"     O: {s['options']}")
                    
    finally:
        db.close()

if __name__ == "__main__":
    sid = int(sys.argv[1]) if len(sys.argv) > 1 else 3 # Default to counting review
    asyncio.run(sample_questions(sid))
