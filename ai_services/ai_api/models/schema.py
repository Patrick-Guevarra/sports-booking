from pydantic import BaseModel
from typing import Optional, List, Dict

class AIQuery(BaseModel):
    message: str
    user_id: Optional[str] = None
    role: str = "athlete"              # future-proofing: "athlete" | "coach"
    context: Optional[Dict] = None     # optional extra info from the app

class AIResponse(BaseModel):
    reply: str
    suggestions: List[str] = []
    meta: Dict = {}                    # e.g., detected intent
