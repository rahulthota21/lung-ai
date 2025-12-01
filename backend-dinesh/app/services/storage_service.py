# app/services/storage_service.py
import json
from app.supabase_client import supabase

class StorageService:

    @staticmethod
    def upload_file(bucket: str, path: str, content: bytes, content_type="application/octet-stream"):
        supabase.storage.from_(bucket).upload(
            path, content, {"content-type": content_type}
        )
        return path

    @staticmethod
    def upload_json(case_id: str, findings_json: dict):
        path = f"{case_id}/findings.json"
        supabase.storage.from_("ml_json").upload(
            path,
            json.dumps(findings_json).encode(),
            {"content-type": "application/json"}
        )
        return path

    @staticmethod
    def upload_pdf(case_id: str, pdf_bytes: bytes, kind: str):
        path = f"{case_id}/{kind}.pdf"
        supabase.storage.from_("reports").upload(
            path, pdf_bytes, {"content-type": "application/pdf"}
        )
        return path
