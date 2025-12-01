# app/routes/process.py
from fastapi import APIRouter, Depends, HTTPException
from app.deps import get_current_user
from app.services.case_service import CaseService
from app.services.ml_service import MLService

router = APIRouter(prefix="/process", tags=["process"])

@router.post("/case/{case_id}")
def process_case(case_id: str, user = Depends(get_current_user)):
    # --- FIX: Added "patient" to allowed roles ---
    if user.role not in ("operator", "doctor", "patient"):
        raise HTTPException(403, "Not allowed")

    case = CaseService.get_case(case_id)
    if not case:
        raise HTTPException(404, "Case not found")

    CaseService.update_status(case_id, "processing")

    try:
        MLService.run_pipeline(case_id, case["storage_path"])
    except Exception as e:
        CaseService.update_status(case_id, "failed")
        # Log the error internally but don't crash the request if possible, 
        # or raise 500 as before. keeping it simple:
        raise HTTPException(500, f"Pipeline error: {e}")

    return {"status": "completed"}