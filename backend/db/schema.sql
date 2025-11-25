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
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    coach_id INTEGER NOT NULL,
    session_type TEXT CHECK(session_type IN ('one-on-one', 'group')) NOT NULL,
    sport TEXT NOT NULL,
    price_per_hour REAL NOT NULL,
    duration_minutes INTEGER NOT NULL,
    description TEXT,
    availability_start DATETIME,
    availability_end DATETIME,
    FOREIGN KEY (coach_id) REFERENCES Users(user_id)
);

CREATE TABLE Bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    athlete_id INTEGER NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    scheduled_time DATETIME NOT NULL,
    status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled'))
        DEFAULT 'pending',
    FOREIGN KEY (session_id) REFERENCES Sessions(session_id),
    FOREIGN KEY (athlete_id) REFERENCES Users(user_id)
);

-- SAMPLE DATA (optional for testing)

INSERT INTO Users (full_name, email, password, role, sport_specialty)
VALUES
('Jordan Coach', 'jordan@coach.com', 'pw1', 'coach', 'Basketball'),
('Pat Coach', 'pat@coach.com', 'pw2', 'coach', 'Tennis'),
('Alex Athlete', 'alex@athlete.com', 'pw3', 'athlete', NULL);

INSERT INTO Sessions (coach_id, session_type, sport, price_per_hour, duration_minutes, description)
VALUES
(1, 'one-on-one', 'Basketball', 50.00, 60, 'Dribbling and shooting drills'),
(2, 'group', 'Tennis', 30.00, 90, 'Serving and rally drills');
