// src/config/api.js

// 🔥 Backend URL (use 127.0.0.1 if you're using an Android/iOS simulator)
<<<<<<< HEAD
=======
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://sports-booking-t0tf.onrender.com";

>>>>>>> e88ad35d3215d7c198d18da32335999968712d75
//export const API_BASE_URL =
//  process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000";

// Generic helper
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    console.warn("API error:", res.status, body);
    throw new Error(body?.detail || "API request failed");
  }

  return body;
}


// ---------- AUTH ROUTES ----------
export function signup({ full_name, email, password, role, sport_specialty }) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      full_name,
      email,
      password,
      role,
      sport_specialty: sport_specialty || null,
    }),
  });
}

export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}


// ---------- AI QUERY ----------
export function aiQuery({ message, userId = null, role = "athlete", context = {} }) {
  return request("/api/ai/query", {
    method: "POST",
    body: JSON.stringify({
      role,
      user_id: userId,
      message,
      context,
    }),
  });
}

export { request };

// ---------- SESSIONS ----------
export function createSession(data) {
  return request("/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listSessions() {
  return request("/sessions");
}

// ---------- BOOKINGS ----------
export function createBooking(data) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function payForBooking(bookingId) {
  return request("/payments/pay", {
    method: "POST",
    body: JSON.stringify({ booking_id: bookingId }),
  });
}

export function listBookings({ athleteId, sessionId, coachId } = {}) {
  const params = new URLSearchParams();
  if (athleteId != null) params.append("athlete_id", athleteId);
  if (sessionId != null) params.append("session_id", sessionId);
  if (coachId != null) params.append("coach_id", coachId);
  return request(`/bookings?${params.toString()}`);
}

export function updateSessionStatus({ sessionId, status, coachId }) {
  return request(`/sessions/${sessionId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, coach_id: coachId }),
  });
}

export function deleteSession({ sessionId, coachId }) {
  return request(`/sessions/${sessionId}?coach_id=${coachId}`, {
    method: "DELETE",
  });
}

export function cancelBooking({ bookingId, athleteId }) {
  return request(`/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ athlete_id: athleteId }),
  });
}
