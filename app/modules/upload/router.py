import os
import shutil
import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.core.config import settings
from typing import Dict, Optional
from google.cloud import storage
from google.oauth2 import service_account
import glob

router = APIRouter()

# Setup Google Cloud Storage Helper
def get_storage_client():
    """
    Creates a Google Cloud Storage client using available credentials.
    Priority:
    1. GOOGLE_CLOUD_KEY_JSON environment variable (JSON string content)
    2. skill-builder-*.json file in root (Local development)
    3. Default environment credentials (GOOGLE_APPLICATION_CREDENTIALS or Metadata server)
    """
    # 1. Try Env Var with JSON content (via Pydantic Settings)
    json_key_str = settings.GOOGLE_CLOUD_KEY_JSON
    if json_key_str:
        try:
            # Clean up potential extra quotes from env var (common copy-paste error)
            json_key_str = json_key_str.strip().strip("'").strip('"')
            
            # Parse the JSON string
            key_info = json.loads(json_key_str)
            # Create credentials object
            credentials = service_account.Credentials.from_service_account_info(key_info)
            return storage.Client(credentials=credentials)
        except Exception as e:
            print(f"Error loading credentials from GOOGLE_CLOUD_KEY_JSON: {e}")
            # Fall through to other methods

    # 2. Try Local File Discovery (Legacy)
    # Only set if not already set, to avoid overwriting existing env config
    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        key_files = glob.glob("skill-builder-*.json")
        if key_files:
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_files[0]
            print(f"Using Google Cloud credentials file: {key_files[0]}")
        else:
            # Just a warning, default client might still work if on GCP
            print("Warning: No Google Cloud JSON key found locally.")

    # 3. Default Client
    return storage.Client()

# Bucket name should be in env or settings
BUCKET_NAME = settings.GOOGLE_CLOUD_BUCKET_NAME
if not BUCKET_NAME:
   print("Warning: GOOGLE_CLOUD_BUCKET_NAME not set in settings.")

from fastapi.responses import StreamingResponse
import io

@router.post("/upload", response_model=Dict[str, str])
async def upload_file(file: UploadFile = File(...), grade: Optional[str] = Form(None)):
    try:
        # Initialize GCS client using helper
        storage_client = get_storage_client()
        bucket = storage_client.bucket(BUCKET_NAME)
        
        # Determine filename with folder structure
        filename = file.filename
        if grade:
            # Create a folder prefix like "grade_5/"
            folder_name = f"grade_{grade}"
            filename = f"{folder_name}/{file.filename}"
        
        # Create a blob (file object) in the bucket
        blob = bucket.blob(filename)
        
        # Upload the file
        blob.upload_from_file(file.file, content_type=file.content_type)
        
        # Return the Proxy URL (served by our backend)
        # This avoids public bucket permission issues
        # Use filename which might contain slashes now
        url = f"{settings.API_V1_STR}/uploads/{filename}"
        
        return {"url": url}
        
    except Exception as e:
        print(f"GCS Upload Error: {e}")
        raise HTTPException(status_code=500, detail=f"Could not save file to GCS: {str(e)}")

@router.get("/uploads/{filename:path}")
async def get_uploaded_file(filename: str):
    try:
        # Initialize GCS client using helper
        storage_client = get_storage_client()
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(filename)
        
        if not blob.exists():
            raise HTTPException(status_code=404, detail="File not found")
            
        # Download the file content
        content = blob.download_as_bytes()
        
        # Determine content type (fallback to octet-stream)
        content_type = blob.content_type or "application/octet-stream"
        
        return StreamingResponse(io.BytesIO(content), media_type=content_type)
    except Exception as e:
        print(f"GCS Download Error: {e}")
        raise HTTPException(status_code=404, detail="File not found or inaccessible")
