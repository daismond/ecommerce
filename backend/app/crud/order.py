from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from .. import models, schemas

def generate_order_number() -> str:
    """Generates a unique order number."""
    now = datetime.utcnow()
    return f"ORD-{now.strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

def create_order_from_cart(db: Session, cart: models.cart.Cart, shipping_address: dict) -> models.order.Order:
    """
    Creates an order in the database from a shopping cart.
    """
    total_amount = sum(item.quantity * item.product_variant.price for item in cart.items)

    db_order = models.order.Order(
        order_number=generate_order_number(),
        user_id=cart.user_id,
        status="pending_payment",
        total_amount=total_amount,
        shipping_address=shipping_address,
        billing_address=shipping_address, # Assuming same for simplicity
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create order items from cart items
    for item in cart.items:
        db_order_item = models.order.OrderItem(
            order_id=db_order.id,
            product_variant_id=item.product_variant_id,
            quantity=item.quantity,
            unit_price=item.product_variant.price,
        )
        db.add(db_order_item)

    # Clear the cart after creating the order
    for item in cart.items:
        db.delete(item)

    db.commit()
    db.refresh(db_order)

    return db_order