from passlib.context import CryptContext
import traceback

print("Testing bcrypt...")
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hash = pwd_context.hash("testpassword")
    print(f"Hash generated: {hash}")
    verify = pwd_context.verify("testpassword", hash)
    print(f"Verification result: {verify}")
except Exception as e:
    print(f"Bcrypt failed: {e}")
    traceback.print_exc()
