# backend/seed_data.py
from pathlib import Path
import sqlite3
from passlib.hash import bcrypt

# Correct: backend/db/sports_booking.db
BASE_DIR = Path(__file__).resolve().parents[0]   # backend/
DB_PATH = BASE_DIR / "db" / "sports_booking.db"

def get_conn():
    return sqlite3.connect(DB_PATH)

def seed():
    conn = get_conn()
    cur = conn.cursor()

    print("Seeding database...")

    # Clear previous data for consistent state
    cur.executescript("""
        DELETE FROM Bookings;
        DELETE FROM Sessions;
        DELETE FROM Users;
    """)

    # Simple, short sample credentials
    sample_users = [
        ("Coach Mark",   "coach1@test.com",   "c1", "coach", "Basketball"),
        ("Coach Emma",   "coach2@test.com",   "c2", "coach", "Soccer"),
        ("Athlete Alex", "athlete1@test.com", "a1", "athlete", None),
        ("Athlete Maya", "athlete2@test.com", "a2", "athlete", None),
    ]

    for full_name, email, pw, role, specialty in sample_users:
        hashed = bcrypt.hash(pw)
        cur.execute(
            """
            INSERT INTO Users (full_name, email, password, role, sport_specialty)
            VALUES (?, ?, ?, ?, ?)
            """,
            (full_name, email, hashed, role, specialty),
        )

    conn.commit()
    conn.close()
    print("✔ Seed data inserted successfully!")

if __name__ == "__main__":
    seed()
