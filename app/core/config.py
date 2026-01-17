from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres.tacaxuzpkumxemwfoyyz:FxQsaEljMblGt8Ed@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
    JWT_SECRET: str = "CHANGE_ME"
    JWT_ALGORITHM: str = "HS256"
    API_V1_STR: str = "/api/v1"
    ADMIN_EMAIL: str = "admin@learners.com"
    ADMIN_PASSWORD: str = "admin123"
    
    class Config:
        env_file = ".env"

settings = Settings()
