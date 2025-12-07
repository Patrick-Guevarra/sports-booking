from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from pathlib import Path
from typing import Literal
import sqlite3
from passlib.hash import bcrypt

# Authentication router handles signup/login against the local SQLite user table.
# Passwords are hashed with bcrypt; tokens are not issued here to keep the sample simple.

router = APIRouter(prefix="/auth", tags=["auth"])

# ---- constants ----
MAX_PASSWORD_BYTES = 72  # bcrypt limit


# Path to DB
BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "sports_booking.db"


def get_conn():
    # Open a short-lived SQLite connection for each request to avoid sharing cursors.
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
    """
    Registers a new user. Validates email uniqueness and role, hashes the password,
    and returns a minimal profile payload consumed by the mobile app.
    """
    # ---- password length guard ----
    if len(payload.password.encode("utf-8")) > MAX_PASSWORD_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"Password is too long. Maximum is {MAX_PASSWORD_BYTES} characters.",
        )

    conn = get_conn()
    cur = conn.cursor()

    # check if email already exists
    cur.execute("SELECT user_id FROM Users WHERE email = ?", (payload.email,))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    # hash password (safe now that length is checked)
    hashed_pw = bcrypt.hash(payload.password)

    cur.execute(
        """
        INSERT INTO Users (full_name, email, password, role, sport_specialty)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            payload.full_name,
            payload.email,
            hashed_pw,
            payload.role,
            payload.sport_specialty,
        ),
    )
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
    """
    Authenticates a user against the Users table and returns identity metadata the
    client stores in context. No session tokens are issued—caller is trusted to hold
    the returned identifiers.
    """
    # optional: same guard so bcrypt.verify never sees an overlong password
    if len(payload.password.encode("utf-8")) > MAX_PASSWORD_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"Password is too long. Maximum is {MAX_PASSWORD_BYTES} characters.",
        )

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT user_id, password, role, full_name 
        FROM Users 
        WHERE email = ?
        """,
        (payload.email,),
    )

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
