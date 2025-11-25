from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import ai as ai_router
from backend.routers import auth as auth_router
from backend.routers.auth import router as auth_router



app = FastAPI(title="Sports Booking AI API")

# CORS open during dev so Expo can talk to it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten later
    allow_credentials=True, #allows cookies, auth headers, tokens, etc.
    allow_methods=["*"], # allows all http methods
    allow_headers=["*"], # allows any custom headers the frontend sends
    
)

app.include_router(ai_router.router)
app.include_router(auth_router)


@app.get("/health")
def health():
    return {"status": "ok"}
