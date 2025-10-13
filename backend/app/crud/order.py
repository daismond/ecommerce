from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uuid
from datetime import datetime

from .. import models, schemas

def get_order(db: Session, order_id: uuid.UUID) -> Optional[models.order.Order]:
    """Get a single order by its ID, including items and variants."""
    return db.query(models.order.Order).options(
        joinedload(models.order.Order.items).joinedload(models.order.OrderItem.product_variant)
    ).filter(models.order.Order.id == order_id).first()

def get_orders(db: Session, skip: int = 0, limit: int = 100) -> List[models.order.Order]:
    """Get a list of all orders."""
    return db.query(models.order.Order).order_by(models.order.Order.created_at.desc()).offset(skip).limit(limit).all()

def get_orders_by_user(db: Session, user_id: uuid.UUID) -> List[models.order.Order]:
    """Get all orders for a specific user, including items, variants, and product details."""
    return db.query(models.order.Order).options(
        joinedload(models.order.Order.items)
        .joinedload(models.order.OrderItem.product_variant)
        .joinedload(models.product.ProductVariant.product)
    ).filter(models.order.Order.user_id == user_id).order_by(models.order.Order.created_at.desc()).all()

def update_order_status(db: Session, order_id: uuid.UUID, status: str) -> Optional[models.order.Order]:
    """Update the status of an order."""
    db_order = get_order(db, order_id)
    if db_order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
    return db_order

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