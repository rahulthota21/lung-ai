import random, string, datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
# Import the shared supabase client
from app.supabase_client import supabase 

router = APIRouter(prefix="/auth", tags=["auth"])

# --- Request Models ---
class CreatePatientRequest(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str
    dob: str
    gender: str

def generate_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

@router.post("/send-code")
def send_code(email: str, purpose: str):
    try:
        user = supabase.auth.admin.list_users(email=email)
        users_list = user.users if hasattr(user, "users") else user.get("users", [])
        
        if not users_list or len(users_list) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = users_list[0].id if hasattr(users_list[0], "id") else users_list[0]["id"]

    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=404, detail="User not found or database error")

    code = generate_code()
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    
    supabase.table("email_codes").insert({
        "user_id": user_id,
        "code": code,
        "purpose": purpose,
        "expires_at": expires_at.isoformat()
    }).execute()

    return {"status": "ok", "code": code, "message": "Code generated"}

@router.post("/verify-code")
def verify_code(email: str, code: str, purpose: str):
    try:
        user = supabase.auth.admin.list_users(email=email)
        users_list = user.users if hasattr(user, "users") else user.get("users", [])
        
        if not users_list or len(users_list) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = users_list[0].id if hasattr(users_list[0], "id") else users_list[0]["id"]
    except Exception:
         raise HTTPException(status_code=404, detail="User not found")

    res = supabase.table("email_codes").select("*").eq("user_id", user_id).eq("code", code).eq("purpose", purpose).eq("used", False).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    record = res.data[0]
    try:
        expires_at = datetime.datetime.fromisoformat(record["expires_at"].replace("Z", ""))
        if expires_at < datetime.datetime.utcnow():
             raise HTTPException(status_code=400, detail="Code expired")
    except ValueError:
        pass 

    supabase.table("email_codes").update({"used": True}).eq("id", record["id"]).execute()
    return {"status": "verified"}

@router.post("/create-patient")
def create_patient(data: CreatePatientRequest):
    try:
        print(f"Creating patient: {data.email}")
        
        auth_res = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": data.full_name,
                "role": "patient"
            }
        })
        
        new_user = auth_res.user if hasattr(auth_res, "user") else auth_res
        if not new_user:
             raise Exception("Failed to create auth user")
             
        user_id = new_user.id if hasattr(new_user, "id") else new_user["id"]

        profile_data = {
            "id": user_id,
            "full_name": data.full_name,
            "phone": data.phone,
            "dob": data.dob,
            "gender": data.gender,
            "role": "patient",
            "country": "India",
            "state": "Unknown",
            "city": "Unknown",
            "postal_code": "000000"
        }
        
        supabase.table("profiles").insert(profile_data).execute()
        
        return {"status": "created", "user_id": user_id}

    except Exception as e:
        print(f"Create Patient Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# --- NEW: Get Profile (Admin Bypass) ---
# Allows Operator to fetch patient details via backend to avoid RLS errors
@router.get("/profile/{user_id}")
def get_profile(user_id: str):
    try:
        res = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return res.data[0]
    except Exception as e:
        print(f"Get Profile Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))