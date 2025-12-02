from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import stripe
from dotenv import load_dotenv

load_dotenv()  # load values from .env

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter(
    prefix="/payments",
    tags=["payments"],
)

class CheckoutRequest(BaseModel):
    price_id: str   # Stripe price ID
    quantity: int = 1

@router.post("/create-checkout-session")
def create_checkout_session(body: CheckoutRequest):
    if stripe.api_key is None:
        raise HTTPException(status_code=500, detail="Stripe API key not configured")

    success_url = os.getenv("FRONTEND_SUCCESS_URL", "http://localhost:3000/payment-success")
    cancel_url = os.getenv("FRONTEND_CANCEL_URL", "http://localhost:3000/payment-cancel")

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[{
                "price": body.price_id,
                "quantity": body.quantity,
            }],
            success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=cancel_url,
        )
        return {"checkout_url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
