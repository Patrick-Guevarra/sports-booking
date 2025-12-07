from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
import sqlite3

# Payment router simulates taking payment for a booking; no gateway integration.

router = APIRouter(prefix="/payments", tags=["payments"])

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "sports_booking.db"


def get_conn():
    # Keep SQLite access per-request to avoid shared cursors.
    return sqlite3.connect(DB_PATH)


class PaymentRequest(BaseModel):
    booking_id: int


@router.post("/pay")
def pay_booking(payload: PaymentRequest):
    """
    Simulated payment:
    - Finds an existing booking
    - Marks it confirmed
    Used by mobile "Pay" buttons to advance booking state without real checkout.
    """
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        "SELECT status FROM Bookings WHERE booking_id = ?", (payload.booking_id,)
    )
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Booking not found")

    current_status = row[0]
    if current_status == "cancelled":
        conn.close()
        raise HTTPException(status_code=400, detail="Booking is cancelled")

    # If already confirmed/completed, just return the existing status
    if current_status in ("confirmed", "completed"):
        conn.close()
        return {"booking_id": payload.booking_id, "status": current_status}

    cur.execute(
        "UPDATE Bookings SET status = 'confirmed' WHERE booking_id = ?",
        (payload.booking_id,),
    )
    conn.commit()
    conn.close()

    return {"booking_id": payload.booking_id, "status": "confirmed"}
