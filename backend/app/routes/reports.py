# backend/app/routes/reports.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.routes.upload import get_scan_store

router = APIRouter(prefix="/report", tags=["reports"])


@router.get("/clinician/{study_id}")
async def get_clinician_report(study_id: str):
    """
    Get clinician report.
    Currently returns JSON. PDF coming when Kowshik delivers code.
    """
    scan_store = get_scan_store()
    
    if study_id not in scan_store:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    findings = scan_store[study_id]["findings"]
    
    # Return JSON for now, PDF later
    return {
        "status": "json_only",
        "message": "PDF generation pending - Kowshik's code",
        "data": findings.model_dump()
    }


@router.get("/patient/{study_id}")
async def get_patient_report(study_id: str, lang: str = "en"):
    """
    Get patient report.
    Currently returns JSON. PDF coming when Kowshik delivers code.
    """
    scan_store = get_scan_store()
    
    if study_id not in scan_store:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    findings = scan_store[study_id]["findings"]
    
    # Return JSON for now, PDF later
    return {
        "status": "json_only",
        "message": "PDF generation pending - Kowshik's code",
        "lang": lang,
        "data": {
            "study_id": findings.study_id,
            "patient_name": findings.patient_name,
            "lung_health": findings.lung_health,
            "num_nodules": findings.num_nodules,
            "summary_text": findings.summary_text
        }
    }