from app.modules.upload.router import get_storage_client, BUCKET_NAME

try:
    print("Attempting to create GCS client...")
    client = get_storage_client()
    print("Client created successfully.")
    print(f"Project: {client.project}")
    bucket = client.bucket(BUCKET_NAME)
    print(f"Bucket object created: {bucket.name}")
except Exception as e:
    print(f"FAILED: {e}")
