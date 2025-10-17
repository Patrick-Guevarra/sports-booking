from pathlib import Path
from .router import detect_intent

KB_DIR = Path(__file__).parent / "knowledge"

def load_kb():
    kb = {}
    for name in ["faq_basic.md", "pricing_rules.md", "policies.md"]:
        p = KB_DIR / name
        kb[name] = p.read_text(encoding="utf-8") if p.exists() else ""
    return kb

def answer(text: str) -> dict:
    intent = detect_intent(text)
    kb = load_kb()

    if intent == "pricing":
        # simple rule: 1-on-1 costs more; price ~ time * rate * multiplier
        return {
            "intent": intent,
            "answer": (
                "One-on-one sessions cost more than group. Pricing is based on session type "
                "and duration. Example: total = rate_per_hour × hours × type_multiplier "
                "(1.0 for group, 1.5 for one-on-one)."
            ),
            "next_actions": ["See available sessions", "Compare one-on-one vs group"]
        }

    if intent == "booking_help":
        return {
            "intent": intent,
            "answer": (
                "To book: choose a coach → pick a time → confirm. You can reschedule before "
                "the session window closes; cancellations follow the refund policy."
            ),
            "next_actions": ["Show booking steps", "View refund policy"]
        }

    if intent == "training_reco":
        return {
            "intent": intent,
            "answer": (
                "If you want focused, faster improvement, choose one-on-one. For general skill "
                "practice and lower cost per person, choose group. Tell me your sport and goal."
            ),
            "next_actions": ["Collect sport & skill level", "Suggest coaches (coming soon)"]
        }

    if intent == "policy_faq":
        return {
            "intent": intent,
            "answer": (
                "Refunds: full if canceled ≥24h in advance; partial within 24h; no-show is not refundable. "
                "Late policy: coaches wait 10 minutes before marking a no-show."
            ),
            "next_actions": ["Show full policy", "Start a cancellation"]
        }

    if intent == "smalltalk":
        return {"intent": intent, "answer": "Hey! I can help you pick sessions or answer booking questions.", "next_actions": []}

    # fallback uses KB dump for now
    return {"intent": "fallback", "answer": "I can help with pricing, booking, recommendations, or policies. What would you like to know?", "next_actions": []}

if __name__ == "__main__":
    # quick CLI for demos
    while True:
        try:
            q = input("You: ")
            if not q.strip(): break
            print("AI:", answer(q)["answer"])
        except (EOFError, KeyboardInterrupt):
            break
