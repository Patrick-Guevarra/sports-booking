from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
from typing import Optional
import sqlite3

router = APIRouter(prefix="/bookings", tags=["bookings"])

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "sports_booking.db"


def get_conn():
    return sqlite3.connect(DB_PATH)


class BookingCreate(BaseModel):
    session_id: int
    athlete_id: int
    scheduled_time: Optional[str] = None  # e.g. "2025-11-01 10:00"


class BookingCancel(BaseModel):
    athlete_id: int


class BookingQuery(BaseModel):
    athlete_id: Optional[int] = None
    coach_id: Optional[int] = None
    session_id: Optional[int] = None


@router.post("")
def create_booking(payload: BookingCreate):
    conn = get_conn()
    cur = conn.cursor()

    # Validate athlete
    cur.execute(
        "SELECT role FROM Users WHERE user_id = ?", (payload.athlete_id,)
    )
    athlete_row = cur.fetchone()
    if not athlete_row or athlete_row[0] != "athlete":
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid athlete_id")

    # Validate session & default scheduled_time
    cur.execute(
        "SELECT date, start_time, capacity, status FROM Sessions WHERE session_id = ?",
        (payload.session_id,),
    )
    session_row = cur.fetchone()
    if not session_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Session not found")

    session_date, start_time, capacity, status = session_row

    if status != "open":
        conn.close()
        raise HTTPException(status_code=400, detail="Session is not open")

    if capacity is None or capacity <= 0:
        conn.close()
        raise HTTPException(status_code=400, detail="Session is full")

    # Prevent duplicates: return existing active booking for same session/athlete
    cur.execute(
        """
        SELECT booking_id, session_id, athlete_id, scheduled_time, status
        FROM Bookings
        WHERE session_id = ? AND athlete_id = ?
        ORDER BY booking_id DESC
        LIMIT 1
        """,
        (payload.session_id, payload.athlete_id),
    )
    existing = cur.fetchone()
    if existing and existing[4] != "cancelled":
        conn.close()
        b_id, session_id, athlete_id, sched, status = existing
        return {
            "booking_id": b_id,
            "session_id": session_id,
            "athlete_id": athlete_id,
            "scheduled_time": sched,
            "status": status,
        }

    scheduled_time = payload.scheduled_time or f"{session_date} {start_time}"

    cur.execute(
        """
        INSERT INTO Bookings (session_id, athlete_id, scheduled_time, status)
        VALUES (?, ?, ?, 'pending')
        """,
        (payload.session_id, payload.athlete_id, scheduled_time),
    )
    # Decrement available capacity
    cur.execute(
        "UPDATE Sessions SET capacity = capacity - 1 WHERE session_id = ? AND capacity > 0",
        (payload.session_id,),
    )
    if cur.rowcount == 0:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=400, detail="Session is full")

    conn.commit()
    booking_id = cur.lastrowid

    cur.execute(
        """
        SELECT booking_id, session_id, athlete_id, scheduled_time, status
        FROM Bookings
        WHERE booking_id = ?
        """,
        (booking_id,),
    )
    booking_row = cur.fetchone()
    conn.close()

    (
        b_id,
        session_id,
        athlete_id,
        scheduled_time_out,
        status,
    ) = booking_row

    return {
        "booking_id": b_id,
        "session_id": session_id,
        "athlete_id": athlete_id,
        "scheduled_time": scheduled_time_out,
        "status": status,
    }


@router.get("")
def list_bookings(
    athlete_id: Optional[int] = None,
    coach_id: Optional[int] = None,
    session_id: Optional[int] = None,
):
    """
    Fetch bookings for an athlete or coach (by their sessions),
    optionally filtered to a session. Includes session + coach info.
    """
    if athlete_id is None and coach_id is None:
        raise HTTPException(status_code=400, detail="athlete_id or coach_id is required")

    conn = get_conn()
    cur = conn.cursor()

    params = []
    where_clause = "WHERE 1=1"

    if athlete_id is not None:
        where_clause += " AND b.athlete_id = ?"
        params.append(athlete_id)

    if coach_id is not None:
        where_clause += " AND s.coach_id = ?"
        params.append(coach_id)

    if session_id is not None:
        where_clause += " AND b.session_id = ?"
        params.append(session_id)

    cur.execute(
        f"""
        SELECT 
            b.booking_id,
            b.session_id,
            b.athlete_id,
            b.scheduled_time,
            b.status,
            s.sport,
            s.session_type,
            s.date,
            s.start_time,
            s.end_time,
            s.price,
            s.status AS session_status,
            s.capacity,
            u.full_name AS coach_name,
            a.full_name AS athlete_name
        FROM Bookings b
        JOIN Sessions s ON b.session_id = s.session_id
        JOIN Users u ON s.coach_id = u.user_id
        JOIN Users a ON b.athlete_id = a.user_id
        {where_clause}
        ORDER BY b.booking_id DESC
        """,
        params,
    )
    rows = cur.fetchall()
    conn.close()

    return [
        {
            "booking_id": b_id,
            "session_id": s_id,
            "athlete_id": a_id,
            "scheduled_time": sched,
            "status": status,
            "sport": sport,
            "session_type": session_type,
            "date": date,
            "start_time": start_time,
            "end_time": end_time,
            "price": price,
            "session_status": session_status,
            "capacity": capacity,
            "coach_name": coach_name,
            "athlete_name": athlete_name,
        }
        for (
            b_id,
            s_id,
            a_id,
            sched,
            status,
            sport,
            session_type,
            date,
            start_time,
            end_time,
            price,
            session_status,
            capacity,
            coach_name,
            athlete_name,
        ) in rows
    ]


@router.patch("/{booking_id}/cancel")
def cancel_booking(booking_id: int, payload: BookingCancel):
    """
    Cancel a booking as the athlete. Frees capacity back to the session.
    """
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT b.session_id, b.athlete_id, b.status, s.capacity
        FROM Bookings b
        JOIN Sessions s ON b.session_id = s.session_id
        WHERE b.booking_id = ?
        """,
        (booking_id,),
    )
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Booking not found")

    session_id, athlete_id, status, capacity = row

    if athlete_id != payload.athlete_id:
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    if status == "cancelled":
        conn.close()
        return {"booking_id": booking_id, "status": status}

    cur.execute(
        "UPDATE Bookings SET status = 'cancelled' WHERE booking_id = ?",
        (booking_id,),
    )
    # Increment capacity
    cur.execute(
        "UPDATE Sessions SET capacity = capacity + 1 WHERE session_id = ?",
        (session_id,),
    )
    conn.commit()
    conn.close()

    return {"booking_id": booking_id, "status": "cancelled"}
