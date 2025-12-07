import os
from typing import Dict

from groq import Groq

# Thin wrapper around Groq chat completion API. Used by the AI router to keep the
# LLM call isolated from FastAPI routing code.

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

# Lazily build the Groq client if credentials are present; otherwise run in
# "demo" mode to avoid throwing errors during class sessions.
client = None
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)


def generate_ai_reply(message: str, role: str, context: str | None = None) -> Dict[str, str]:
    """
    Returns a dict: {"reply": "..."} for your FastAPI response model.
    Uses Groq if GROQ_API_KEY is set, otherwise returns a placeholder.
    """

    # If no API key, just send a dummy response (so the endpoint doesn't crash in class demos)
    if client is None:
        return {
            "reply": (
                "AI is currently disabled (no GROQ_API_KEY configured). "
                "Please contact the developers to enable cloud AI."
            )
        }

    system_prompt = (
        "You are an AI assistant for a sports training booking app. "
        "You help athletes find training sessions, ask coaches questions, and "
        "understand booking details. Keep answers short, clear, and helpful."
    )

    # Build chat messages
    messages = [
        {"role": "system", "content": system_prompt},
    ]

    if context:
        # Provide structured app state (bookings, sessions, etc.) as extra system guidance.
        messages.append(
            {
                "role": "system",
                "content": f"Here is extra context about the user or app: {context}",
            }
        )

    # User message (you can include `role` here too if you want)
    messages.append(
        {
            "role": "user",
            "content": f"User type: {role}. Message: {message}",
        }
    )

    # Call Groq
    chat_completion = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        temperature=0.4,
        max_tokens=512,
    )

    reply_text = chat_completion.choices[0].message.content
    return {"reply": reply_text}
