from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routers import payments, sessions, auth, ai, bookings

app = FastAPI(title="Sports Booking AI API")

# CORS so Expo/mobile can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth.router)
app.include_router(sessions.router)
app.include_router(bookings.router)
app.include_router(payments.router)   
app.include_router(ai.router)


@app.get("/health")
def health():
    return {"status": "ok"}
