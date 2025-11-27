-- backend/db/schema.sql

DROP TABLE IF EXISTS Bookings;
DROP TABLE IF EXISTS Sessions;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('athlete', 'coach')) NOT NULL,
    sport_specialty TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Sessions (
    session_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    coach_id        INTEGER NOT NULL,
    sport           TEXT NOT NULL,
    session_type    TEXT CHECK(session_type IN ('one-on-one', 'group')) NOT NULL,
    date            TEXT NOT NULL,          -- 'YYYY-MM-DD'
    start_time      TEXT NOT NULL,          -- 'HH:MM'
    end_time        TEXT NOT NULL,          -- 'HH:MM'
    price           REAL NOT NULL,
    capacity        INTEGER NOT NULL,
    status          TEXT CHECK(status IN ('open', 'closed')) NOT NULL DEFAULT 'open',
    location        TEXT,
    description     TEXT,
    created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES Users(user_id)
);


CREATE TABLE Bookings (
    booking_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id    INTEGER NOT NULL,
    athlete_id    INTEGER NOT NULL,
    booking_date  DATETIME DEFAULT CURRENT_TIMESTAMP,
    scheduled_time DATETIME NOT NULL,
    status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled'))
           DEFAULT 'pending',
    FOREIGN KEY (session_id) REFERENCES Sessions(session_id),
    FOREIGN KEY (athlete_id) REFERENCES Users(user_id)
);
