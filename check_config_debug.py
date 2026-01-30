from app.core.config import settings

print("--- CONFIG CHECK ---")
print(f"EMAIL: '{settings.ADMIN_EMAIL}'")
print(f"PASS: '{settings.ADMIN_PASSWORD}'")
print(f"JSON_KEY_LEN: {len(settings.GOOGLE_CLOUD_KEY_JSON) if settings.GOOGLE_CLOUD_KEY_JSON else 0}")
print("--- END ---")
