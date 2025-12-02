from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routers import payments  

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
app.include_router(payments.router)   


@app.get("/health")
def health():
    return {"status": "ok"}

