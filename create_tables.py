import sys
import os

# Add current directory to path so we can import app
sys.path.append(os.getcwd())

from app.db.base import Base
from app.db.session import engine
# Import ALL models so they are registered in Base
from app.modules.auth import models as auth_models
from app.modules.teacher import models as teacher_models
from app.modules.student import models as student_models
from app.modules.parent import models as parent_models
from app.modules.lottery import models as lottery_models
from app.modules.admin import models as admin_models
from app.modules.guest import models as guest_models
from app.modules.mentorship import models as mentorship_models
# from app.modules.profile import models as profile_models

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created.")
