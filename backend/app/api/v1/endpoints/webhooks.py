from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
import stripe
import os

from app import crud
from app.services import email_service
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
            # Update order status to 'processing'
            order = crud.order.update_order_status(db, order_id=order_id, status="processing")
            if order:
                print(f"Payment for order {order.order_number} succeeded. Status updated to 'processing'.")
                # Send confirmation email
                email_service.send_order_confirmation_email(order)
            else:
                print(f"Order with ID {order_id} not found.")
        else:
            print("PaymentIntent succeeded but no order_id found in metadata.")

    else:
        print(f"Unhandled event type {event['type']}")

    return {"status": "success"}