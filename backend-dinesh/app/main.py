# backend-dinesh/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# --- FIX: Import 'auth' ---
from app.routes import upload, process, cases, doctor, chat, scan_results, auth

app = FastAPI(title="CT Backend FYP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# --- Register Routes ---
app.include_router(upload.router)
app.include_router(process.router)
app.include_router(cases.router)
app.include_router(doctor.router)
app.include_router(chat.router)
app.include_router(scan_results.router)
# --- FIX: Enable Auth Router ---
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Backend Running"}