from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
import stripe
import os

from app import crud
from app.api.v1.dependencies import get_db

router = APIRouter()

# Get webhook secret from environment
stripe_webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None), db: Session = Depends(get_db)):
    """
    Stripe webhook endpoint to handle events like successful payments.
    """
    if not stripe_webhook_secret:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stripe webhook secret is not configured.")

    try:
        payload = await request.body()
        event = stripe.Webhook.construct_event(
            payload=payload, sig_header=stripe_signature, secret=stripe_webhook_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid payload: {e}")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid signature: {e}")

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        order_id = payment_intent['metadata'].get('order_id')

        if order_id:
            # You would need a CRUD function to get order by ID and update its status
            # For now, let's assume we have one:
            # order = crud.order.get(db, id=order_id)
            # if order:
            #     order.status = "processing"
            #     db.commit()
            print(f"Payment for order {order_id} succeeded.")
        else:
            print("PaymentIntent succeeded but no order_id found in metadata.")

    else:
        print(f"Unhandled event type {event['type']}")

    return {"status": "success"}