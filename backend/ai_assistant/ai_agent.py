import os
from typing import Dict, Any, Optional

import requests

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")

SYSTEM_PROMPT = """
You are an AI assistant for a sports training booking app.

The app currently:
- Offers sports: basketball, soccer, tennis, track conditioning.
- Has two session types: "one_on_one" and "group".
- Shows coaches, prices (in cents), duration, and capacity.
- Lets athletes browse sessions, view details, and (for now) create simulated bookings.
- Has booking statuses: "pending", "confirmed", "canceled", "completed".

Your job:
- Answer questions about sports, sessions, pricing, booking flow, and coach options.
- If the user asks about features we don't have, explain the current limitations.
- Keep answers short, specific, and friendly.
- If you're not sure, say you don't know instead of making things up.
""".strip()

def generate_ai_reply(
    message: str,
    role: str = "athlete",
    context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Call a local Ollama model and return a dict shaped like AIResponse:
    { "reply": str, "suggestions": List[str], "meta": Dict }
    """

    # You can weave role/context into the prompt later if you want
    user_prompt = message

    full_prompt = f"{SYSTEM_PROMPT}\n\nUser role: {role}\n\nUser: {user_prompt}"

    # Call Ollama's /api/generate endpoint (non-streaming)
    resp = requests.post(
        f"{OLLAMA_BASE_URL}/api/generate",
        json={
            "model": "llama3.2",  # or "llama3" or whatever you pulled
            "prompt": full_prompt,
            "stream": False,      # so we just get one JSON response
        },
        timeout=60,
    )
    resp.raise_for_status()
    data = resp.json()

    reply_text = data.get("response", "").strip()
    if not reply_text:
        reply_text = "Sorry, I couldn't generate a response just now."

    return {
        "reply": reply_text,
        "suggestions": [],  # you can fill these later if you want
        "meta": {
            "model": "llama3.2",
            "source": "ollama",
        },
    }