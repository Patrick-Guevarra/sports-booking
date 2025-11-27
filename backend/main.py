from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import ai as ai_router
from backend.routers import auth as auth_router
from backend.routers import sessions as sessions_router   # 👈 NEW

app = FastAPI(title="Sports Booking AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router.router)
app.include_router(auth_router.router)
app.include_router(sessions_router.router)                 # 👈 NEW

@app.get("/health")
def health():
    return {"status": "ok"}
