# backend/routers/payments.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

router = APIRouter(prefix="/payments", tags=["payments"])

# What the frontend will send us
class PaymentRequest(BaseModel):
    amount: int
    currency: str = "usd"
    description: str | None = None
    user_id: int | None = None
    booking_id: int | None = None

# What we send back
class PaymentResponse(BaseModel):
    payment_id: str
    status: str
    amount: int
    currency: str
    description: str | None = None
    simulated: bool = True


@router.post("/create-checkout-session", response_model=PaymentResponse)
async def create_checkout_session(body: PaymentRequest):
    # Basic validation
    if body.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    # Fake “payment id” like a gateway would give us
    payment_id = f"sim_{uuid4().hex[:12]}"

    # If you want to, this is where you’d also save
    # a record in the database (payments table, etc.)

    return PaymentResponse(
        payment_id=payment_id,
        status="succeeded",     # always success for this simulation
        amount=body.amount,
        currency=body.currency,
        description=body.description,
        simulated=True,
    )
