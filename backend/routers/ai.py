# create api endpoints here

from fastapi import APIRouter
from pathlib import Path
import sqlite3
from models.schema import AIQuery, AIResponse
from ..ai_assistant.ai_agent import generate_ai_reply

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Reuse the same DB path pattern as sessions.py
BASE_DIR = Path(__file__).resolve().parents[1]  # backend/
DB_PATH = BASE_DIR / "db" / "sports_booking.db"


def get_conn():
    return sqlite3.connect(DB_PATH)

@router.post("/query", response_model=AIResponse)
def ai_query(payload: AIQuery):
    """
    AI endpoint:
    - For athletes, fetch some DB data (bookings + open sessions)
    - Build a text context
    - Pass that into generate_ai_reply so Ollama can answer based on real data.
    """

    # Start from whatever context the caller may have sent (usually None)
    base_context = payload.context or {}
    context = dict(base_context)  # copy so we don't mutate the original

    db_context_lines: list[str] = []

    # Only build DB context for athletes
    if payload.role == "athlete":
        conn = get_conn()
        cur = conn.cursor()

        # 1) If we know the athlete's user_id, fetch their upcoming bookings
        if payload.user_id is not None:
            cur.execute(
                """
                SELECT
                    b.booking_id,
                    b.status,
                    b.scheduled_time,
                    s.sport,
                    s.session_type,
                    s.date,
                    s.start_time,
                    s.end_time,
                    u.full_name AS coach_name
                FROM Bookings b
                JOIN Sessions s ON b.session_id = s.session_id
                JOIN Users u ON s.coach_id = u.user_id
                WHERE b.athlete_id = ?
                ORDER BY b.scheduled_time
                LIMIT 5
                """,
                (payload.user_id,),
            )
            bookings = cur.fetchall()

            if bookings:
                db_context_lines.append("Athlete upcoming bookings (up to 5):")
                for (
                    booking_id,
                    status,
                    scheduled_time,
                    sport,
                    session_type,
                    date,
                    start_time,
                    end_time,
                    coach_name,
                ) in bookings:
                    db_context_lines.append(
                        f"- Booking {booking_id}: {sport} {session_type} with {coach_name} "
                        f"on {date} {start_time}-{end_time}, status: {status}, "
                        f"scheduled_time: {scheduled_time}"
                    )
            else:
                db_context_lines.append("Athlete has no upcoming bookings.")

        # 2) Fetch some open sessions for the athlete to choose from
        cur.execute(
            """
            SELECT
                s.session_id,
                s.sport,
                s.session_type,
                s.date,
                s.start_time,
                s.end_time,
                s.price,
                s.capacity,
                s.status,
                s.location,
                u.full_name AS coach_name
            FROM Sessions s
            JOIN Users u ON s.coach_id = u.user_id
            WHERE s.status = 'open'
            ORDER BY s.date, s.start_time
            LIMIT 5
            """
        )
        sessions = cur.fetchall()
        conn.close()

        if sessions:
            db_context_lines.append("")
            db_context_lines.append("Open sessions (showing up to 5):")
            for (
                session_id,
                sport,
                session_type,
                date,
                start_time,
                end_time,
                price,
                capacity,
                status,
                location,
                coach_name,
            ) in sessions:
                db_context_lines.append(
                    f"- Session {session_id}: {sport} {session_type} with {coach_name} "
                    f"on {date} {start_time}-{end_time}, price: {price}, "
                    f"capacity: {capacity}, location: {location or 'TBD'}"
                )

    # Join all DB-derived lines into a single text block
    db_context_text = "\n".join(db_context_lines).strip()
    if db_context_text:
        context["db_context"] = db_context_text

    # Call the AI agent with message + role + enriched context
    result = generate_ai_reply(
        message=payload.message,
        role=payload.role,
        context=context or None,
    )

    # result is a dict: { reply, suggestions, meta }
    return AIResponse(**result)
