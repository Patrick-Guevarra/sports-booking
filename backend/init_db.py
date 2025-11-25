# backend/init_db.py
from pathlib import Path
import sqlite3

# Base directory: backend/
BASE_DIR = Path(__file__).resolve().parent

# Make sure db folder exists
DB_DIR = BASE_DIR / "db"
DB_DIR.mkdir(exist_ok=True)

DB_PATH = DB_DIR / "sports_booking.db"
SCHEMA_PATH = DB_DIR / "schema.sql"


def init_db():
    print(f"Creating DB at: {DB_PATH}")

    # open (or create) the .db file
    conn = sqlite3.connect(DB_PATH)

    # read and execute the schema.sql script
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        sql = f.read()

    conn.executescript(sql)
    conn.commit()
    conn.close()

    print("✅ Database initialized")


if __name__ == "__main__":
    init_db()
