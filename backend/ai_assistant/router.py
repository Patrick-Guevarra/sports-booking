import re
from .intents import INTENTS

def detect_intent(text: str) -> str:
    t = text.lower()
    for intent, keywords in INTENTS.items():
        if any(re.search(rf"\b{re.escape(k)}\b", t) for k in keywords):
            return intent
    return "fallback"
