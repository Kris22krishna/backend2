from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str = "CHANGE_ME"
    JWT_ALGORITHM: str = "HS256"
    API_V1_STR: str = "/api/v1"
    ADMIN_EMAIL: str = "admin@learners.com"
    ADMIN_PASSWORD: str = "admin123"
    GOOGLE_CLOUD_BUCKET_NAME: str = "your-bucket-name-here"
    GOOGLE_CLOUD_KEY_JSON: str | None = None
    
    class Config:
        env_file = ".env"

settings = Settings()
