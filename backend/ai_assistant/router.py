import re
from ai_assistant.intents import INTENTS

# Simple keyword-based intent detector to steer AI responses; not exposed as an API.

def detect_intent(text: str) -> str:
    # Lower-case and look for keyword matches; falls back to generic handling.
    t = text.lower()
    for intent, keywords in INTENTS.items():
        if any(re.search(rf"\b{re.escape(k)}\b", t) for k in keywords):
            return intent
    return "fallback"
