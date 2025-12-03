// src/config/api.js

// 🔥 Backend URL (use 127.0.0.1 if you're using an Android/iOS simulator
//    or your laptop's IP address if you test on a real phone)
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ----------------- GENERIC HELPER -----------------
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
  } catch (e) {
    // Not JSON, just keep raw text
    body = text;
  }

  if (!res.ok) {
    console.warn("API error:", res.status, body);
    throw new Error(body?.detail || "API request failed");
  }

  return body;
}

// -------- AUTH ROUTES --------
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

// -------- AI QUERY --------
export function aiQuery({
  message,
  userId = null,
  role = "athlete",
  context = {},
}) {
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

// -------- SESSIONS --------
export function createSession(data) {
  return request("/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listSessions() {
  return request("/sessions");
}

// -------- PAYMENTS --------
/**
 * Simulate a payment for a booking.
 *
 * @param {Object} params
 * @param {number} params.amount      - Amount in cents (e.g. 5000 = $50.00)
 * @param {number} params.user_id     - ID of the user paying
 * @param {number} params.booking_id  - Related booking ID
 * @param {string} [params.currency]  - Currency code (default "usd")
 * @param {string} [params.description] - Description for the record
 */
export function simulatePayment({
  amount,
  user_id,
  booking_id,
  currency = "usd",
  description = "Court booking payment",
}) {
  return request("/payments/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({
      amount,
      currency,
      description,
      user_id,
      booking_id,
    }),
  });
}

// In case other files want to use the low-level helper directly
export { request };
