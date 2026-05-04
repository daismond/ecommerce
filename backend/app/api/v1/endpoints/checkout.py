from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import stripe
import os

from app import crud, models, schemas
from app.api.v1.endpoints.cart import get_or_create_cart
from app.api.v1.dependencies import get_db

# Configure Stripe API key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

@router.post("/", response_model=schemas.order.CheckoutSession)
def create_checkout_session(
    checkout_data: schemas.order.CheckoutSessionCreate,
    cart: models.cart.Cart = Depends(get_or_create_cart),
    db: Session = Depends(get_db)
):
    """
    Creates a checkout session.
    1. Creates an order in the database from the cart.
    2. Creates a Stripe PaymentIntent.
    3. Returns the client_secret to the frontend.
    """
    if not cart.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot checkout with an empty cart")

    # 1. Create an order in our database
    order = crud.order.create_order_from_cart(db, cart=cart, shipping_address=checkout_data.shipping_address)

    # 2. Create a Stripe PaymentIntent
    try:
        # Amount in cents
        amount_in_cents = int(order.total_amount * 100)

        payment_intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency="usd", # This should be configurable
            metadata={
                "order_id": str(order.id),
                "user_id": str(order.user_id) if order.user_id else "guest"
            }
        )
    except Exception as e:
        # If Stripe fails, we should probably roll back our order creation or mark it as failed.
        # For now, we'll just raise an error.
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create payment intent: {e}")

    return {
        "client_secret": payment_intent.client_secret,
        "order_id": order.id
    }