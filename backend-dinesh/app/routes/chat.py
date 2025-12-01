# app/routes/chat.py
from fastapi import APIRouter, Depends, HTTPException
from app.deps import get_current_user
from app.services.case_service import CaseService
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])

# --------------------------
# SEND MESSAGE
# --------------------------
@router.post("/send/{assignment_id}")
def send_message(assignment_id: str, data: dict, user=Depends(get_current_user)):

    # 1) Check assignment exists
    assignment = CaseService.get_assignment(assignment_id)
    if not assignment:
        raise HTTPException(404, "Assignment not found")

    # 2) Only doctor or patient can chat
    if user.role not in ("doctor", "patient"):
        raise HTTPException(403, "Not allowed")

    # 3) Patient must match case patient
    if user.role == "patient":
        case = CaseService.get_case(assignment["scan_id"])
        if case["patient_id"] != user.id:
            raise HTTPException(403, "Not allowed")

    message = data.get("message")
    attachment_url = data.get("attachment_url")

    return ChatService.send_message(
        assignment_id=assignment_id,
        sender_id=user.id,
        message=message,
        attachment_url=attachment_url
    )

# --------------------------
# GET CHAT HISTORY
# --------------------------
@router.get("/history/{assignment_id}")
def get_history(assignment_id: str, user=Depends(get_current_user)):
    
    # 1) verify assignment exists
    assignment = CaseService.get_assignment(assignment_id)
    if not assignment:
        raise HTTPException(404, "Assignment not found")

    # 2) verify the user is doctor or patient of this case
    if user.role == "doctor" and assignment["doctor_id"] != user.id:
        raise HTTPException(403, "Forbidden")

    if user.role == "patient":
        case = CaseService.get_case(assignment["scan_id"])
        if case["patient_id"] != user.id:
            raise HTTPException(403, "Forbidden")

    # 3) return messages
    return ChatService.get_history(assignment_id)
