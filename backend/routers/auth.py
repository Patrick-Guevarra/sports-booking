from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from pathlib import Path
from typing import Literal
import sqlite3
from passlib.hash import bcrypt

router = APIRouter(prefix="/auth", tags=["auth"])

# Path to DB
BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "sports_booking.db"

def get_conn():
    return sqlite3.connect(DB_PATH)


# Request models
class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: Literal["athlete", "coach"]
    sport_specialty: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
def signup(payload: SignupRequest):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT user_id FROM Users WHERE email = ?", (payload.email,))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hash(payload.password)

    cur.execute("""
        INSERT INTO Users (full_name, email, password, role, sport_specialty)
        VALUES (?, ?, ?, ?, ?)
    """, (payload.full_name, payload.email, hashed_pw, payload.role, payload.sport_specialty))

    conn.commit()
    user_id = cur.lastrowid
    conn.close()

    return {
        "user_id": user_id,
        "full_name": payload.full_name,
        "email": payload.email,
        "role": payload.role,
    }


@router.post("/login")
def login(payload: LoginRequest):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT user_id, password, role, full_name 
        FROM Users 
        WHERE email = ?
    """, (payload.email,))
    
    row = cur.fetchone()
    conn.close()

    if not row or not bcrypt.verify(payload.password, row[1]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id, _, role, full_name = row

    return {
        "user_id": user_id,
        "email": payload.email,
        "role": role,
        "full_name": full_name,
    }
