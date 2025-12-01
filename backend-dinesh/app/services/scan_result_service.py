# app/services/scan_result_service.py

from app.supabase_client import supabase


class ScanResultService:

    @staticmethod
    def update_json_path(scan_id: str, storage_key: str):
        """
        Updates the scan_results table with the JSON file path.
        If no row exists, inserts a new row.
        """

        # First check if a row exists for this scan
        existing = supabase.table("scan_results").select("*").eq("scan_id", scan_id).execute()

        if existing.data:
            # Update existing row
            print(f"[DB] Updating scan_results for scan_id={scan_id}")
            supabase.table("scan_results").update({
                "findings_json": storage_key   # correct column name
            }).eq("scan_id", scan_id).execute()
        else:
            # Insert new row
            print(f"[DB] Inserting new scan_results row for scan_id={scan_id}")
            supabase.table("scan_results").insert({
                "scan_id": scan_id,
                "findings_json": storage_key
            }).execute()
