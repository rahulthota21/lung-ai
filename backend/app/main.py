from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router
from app.routes.upload import router as upload_router
from app.routes.reports import router as reports_router

app = FastAPI(
    title="Lung-ATM Backend",
    description="CT Scan Analysis and Report Generation API",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Lung-ATM Backend Running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}