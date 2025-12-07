// src/config/api.js
// Centralized API client for the FastAPI backend. Expo env vars override the default Render URL.
// 🔥 Backend URL (use 127.0.0.1 if you're using an Android/iOS simulator)
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://sports-booking-t0tf.onrender.com";
//export const API_BASE_URL =
//  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000";
// Generic helper
async function request(path, options = {}) {
  // Wraps fetch to normalize headers, parse JSON, and surface API errors.
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
  // Creates a user record; accepts both athlete and coach roles.
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
  // Validates credentials and returns minimal identity metadata.
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ---------- AI QUERY ----------
export function aiQuery({ message, userId = null, role = "athlete", context = {} }) {
  // Calls the AI router which enriches the prompt with DB context.
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
  // Coach-facing endpoint to publish a new session.
  return request("/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function listSessions() {
  // Public feed of all sessions (athletes browse, coaches review their own).
  return request("/sessions");
}
// ---------- BOOKINGS ----------
export function createBooking(data) {
  // Athlete books a session and receives pending status until payment.
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function payForBooking(bookingId) {
  // Simulates payment by flipping the booking status to confirmed.
  return request("/payments/pay", {
    method: "POST",
    body: JSON.stringify({ booking_id: bookingId }),
  });
}
export function listBookings({ athleteId, sessionId, coachId } = {}) {
  // Lists bookings filtered by athlete/coach/session; used by both roles.
  const params = new URLSearchParams();
  if (athleteId != null) params.append("athlete_id", athleteId);
  if (sessionId != null) params.append("session_id", sessionId);
  if (coachId != null) params.append("coach_id", coachId);
  return request(`/bookings?${params.toString()}`);
}
export function updateSessionStatus({ sessionId, status, coachId }) {
  // Coaches open/close sessions to control booking intake.
  return request(`/sessions/${sessionId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, coach_id: coachId }),
  });
}
export function deleteSession({ sessionId, coachId }) {
  // Removes a session and its bookings; only coach owner can call.
  return request(`/sessions/${sessionId}?coach_id=${coachId}`, {
    method: "DELETE",
  });
}
export function cancelBooking({ bookingId, athleteId }) {
  // Athlete cancels a booking which frees capacity on the server.
  return request(`/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ athlete_id: athleteId }),
  });
}
