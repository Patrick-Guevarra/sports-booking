from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import ai as ai_router

app = FastAPI(title="Sports Booking AI API")

# CORS open during dev so Expo can talk to it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

app.include_router(ai_router.router)

@app.get("/health")
def health():
    return {"status": "ok"}
