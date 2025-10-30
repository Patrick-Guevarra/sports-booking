// api.js — handles calling your FastAPI backend

// For iOS simulator, localhost works fine.
// If you test on a *physical phone*, replace with your Mac’s LAN IP (find it in Expo Dev Tools).
export const API_BASE_URL = "http://127.0.0.1:8001";

export async function aiQuery({ message, userId = null, context = {} }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: "athlete",
        user_id: userId,
        message,
        context,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI error ${res.status}: ${text}`);
    }
    return await res.json(); // reply, suggestions, meta
  } catch (err) {
    console.warn("AI fetch error:", err);
    return {
      reply:
        "⚠️ I couldn’t connect to the AI service. Make sure it’s running on port 8001.",
      suggestions: [],
      meta: {},
    };
  }
}
