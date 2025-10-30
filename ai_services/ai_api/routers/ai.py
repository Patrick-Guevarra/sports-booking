from fastapi import APIRouter
from ..models.schema import AIQuery, AIResponse

router = APIRouter(prefix="/api/ai", tags=["ai"])

# super simple rule-based reply (placeholder for real AI)
def simple_reply(message: str):
    t = message.lower()
    if any(k in t for k in ["sport", "offer", "what do you have"]):
        return {
            "reply": "We currently offer basketball, soccer, tennis, and track conditioning.",
            "suggestions": ["Show basketball sessions", "Group vs 1-on-1?", "What are the prices?"],
            "meta": {"intent": "sports"}
        }
    if any(k in t for k in ["best", "recommend", "which session"]):
        return {
            "reply": "If you’re new, start with a 1-on-1 fundamentals session, then try a small group drill clinic.",
            "suggestions": ["Find 1-on-1 sessions", "Find group drills", "What should I practice?"],
            "meta": {"intent": "recommendation"}
        }
    return {
        "reply": "I can help with sports, sessions, prices, and coach options. What are you training for?",
        "suggestions": ["What sports do you offer?", "Recommend a session", "How does payment work?"],
        "meta": {"intent": "chitchat"}
    }

@router.post("/query", response_model=AIResponse)
def ai_query(payload: AIQuery):
    result = simple_reply(payload.message)
    return AIResponse(**result)
