from pathlib import Path
import sqlite3

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "sports_booking.db"

# One-off migration helper to add new columns when schema.sql changes.
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.executescript(
    """
    CREATE TABLE IF NOT EXISTS Sessions (
        session_id   INTEGER PRIMARY KEY AUTOINCREMENT,
        coach_id     INTEGER NOT NULL,
        sport        TEXT NOT NULL,
        session_type TEXT NOT NULL, -- 'one-on-one' or 'group'
        date         TEXT NOT NULL, -- 'YYYY-MM-DD'
        time         TEXT NOT NULL, -- 'HH:MM'
        price        REAL NOT NULL,
        location     TEXT,          -- NEW
        description  TEXT,
        created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coach_id) REFERENCES Users(user_id)
    );

    CREATE TABLE IF NOT EXISTS Bookings (
        booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        athlete_id INTEGER NOT NULL,
        status     TEXT NOT NULL DEFAULT 'booked',
        booked_at  TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES Sessions(session_id),
        FOREIGN KEY (athlete_id) REFERENCES Users(user_id)
    );
    """
)

# Try to add location column on older DBs (ignore error if it already exists)
try:
    cur.execute("ALTER TABLE Sessions ADD COLUMN location TEXT;")
except sqlite3.OperationalError:
    pass

conn.commit()
conn.close()
print("✅ Sessions & Bookings tables ensured (with location).")
