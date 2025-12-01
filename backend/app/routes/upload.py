import uuid
import os
from pathlib import Path
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.models.schemas import UploadResponse
from app.services.mock_findings import generate_mock_findings

router = APIRouter(prefix="/scan", tags=["scan"])

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# In-memory store for demo (replace with DB later)
scan_store = {}


@router.post("/upload", response_model=UploadResponse)
async def upload_scan(file: UploadFile = File(...)):
    """Upload CT scan file (DICOM ZIP or NPY)."""
    
    # Validate file type
    allowed_extensions = [".zip", ".npy", ".dcm"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {allowed_extensions}"
        )
    
    # Generate scan ID
    scan_id = f"SCAN_{uuid.uuid4().hex[:8].upper()}"
    
    # Save file
    contents = await file.read()
    file_path = UPLOADS_DIR / f"{scan_id}{file_ext}"
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Generate mock findings (replace with real ML later)
    findings = generate_mock_findings(study_id=scan_id)
    
    # Store in memory
    scan_store[scan_id] = {
        "filename": file.filename,
        "file_path": str(file_path),
        "findings": findings,
        "status": "completed"
    }
    
    return UploadResponse(
        scan_id=scan_id,
        filename=file.filename,
        size_bytes=len(contents),
        status="completed"
    )


@router.get("/{scan_id}/status")
async def get_scan_status(scan_id: str):
    """Get processing status of a scan."""
    
    if scan_id not in scan_store:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return {
        "scan_id": scan_id,
        "status": scan_store[scan_id]["status"]
    }


@router.get("/{scan_id}/findings")
async def get_findings(scan_id: str):
    """Get findings JSON for a scan."""
    
    if scan_id not in scan_store:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return scan_store[scan_id]["findings"]


# Export scan_store for reports route
def get_scan_store():
    return scan_store