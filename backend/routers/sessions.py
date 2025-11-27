# backend/routers/sessions.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
from typing import Optional, Literal
import sqlite3

router = APIRouter(prefix="/sessions", tags=["sessions"])

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "sports_booking.db"


def get_conn():
    return sqlite3.connect(DB_PATH)


class SessionCreate(BaseModel):
    coach_id: int
    sport: str
    session_type: Literal["one-on-one", "group"]
    date: str         # "YYYY-MM-DD"
    start_time: str   # "HH:MM"
    end_time: str     # "HH:MM"
    price: float
    capacity: int
    status: Literal["open", "closed"] = "open"
    location: Optional[str] = None
    description: Optional[str] = None


@router.post("")
def create_session(payload: SessionCreate):
    conn = get_conn()
    cur = conn.cursor()

    # verify coach exists & is a coach
    cur.execute("SELECT role FROM Users WHERE user_id = ?", (payload.coach_id,))
    row = cur.fetchone()
    if not row or row[0] != "coach":
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid coach_id")

    cur.execute(
        """
        INSERT INTO Sessions (
          coach_id, sport, session_type,
          date, start_time, end_time,
          price, capacity, status,
          location, description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload.coach_id,
            payload.sport,
            payload.session_type,
            payload.date,
            payload.start_time,
            payload.end_time,
            payload.price,
            payload.capacity,
            payload.status,
            payload.location,
            payload.description,
        ),
    )
    conn.commit()
    session_id = cur.lastrowid
    conn.close()

    return {"session_id": session_id, **payload.model_dump()}


@router.get("")
def list_sessions():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT
          s.session_id,
          s.coach_id,
          u.full_name AS coach_name,
          s.sport,
          s.session_type,
          s.date,
          s.start_time,
          s.end_time,
          s.price,
          s.capacity,
          s.status,
          s.location,
          s.description
        FROM Sessions s
        JOIN Users u ON s.coach_id = u.user_id
        ORDER BY s.date, s.start_time
        """
    )
    rows = cur.fetchall()
    conn.close()

    sessions = []
    for (
        session_id,
        coach_id,
        coach_name,
        sport,
        session_type,
        date,
        start_time,
        end_time,
        price,
        capacity,
        status,
        location,
        description,
    ) in rows:
        sessions.append(
            {
                "session_id": session_id,
                "coach_id": coach_id,
                "coach_name": coach_name,
                "sport": sport,
                "session_type": session_type,
                "date": date,
                "start_time": start_time,
                "end_time": end_time,
                "price": price,
                "capacity": capacity,
                "status": status,
                "location": location,
                "description": description,
            }
        )

    return sessions
