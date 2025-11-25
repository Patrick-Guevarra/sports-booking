// src/config/api.js

// 🔥 Backend URL (use 127.0.0.1 if you're using an Android/iOS simulator)
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";


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



