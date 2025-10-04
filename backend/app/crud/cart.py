from sqlalchemy.orm import Session, joinedload
from typing import Optional
import uuid

from .. import models, schemas

def get_cart(db: Session, cart_id: Optional[uuid.UUID] = None, user_id: Optional[uuid.UUID] = None) -> Optional[models.cart.Cart]:
    """
    Get a cart by its ID or by user ID.
    Prefers user_id if both are provided.
    Includes cart items and their associated product variants and the parent product.
    """
    query = db.query(models.cart.Cart).options(
        joinedload(models.cart.Cart.items)
        .joinedload(models.cart.CartItem.product_variant)
        .joinedload(models.product.ProductVariant.product)
    )
    if user_id:
        return query.filter(models.cart.Cart.user_id == user_id).first()
    if cart_id:
        return query.filter(models.cart.Cart.id == cart_id).first()
    return None

def create_cart(db: Session, user_id: Optional[uuid.UUID] = None) -> models.cart.Cart:
    """
    Create a new empty cart, optionally for a specific user.
    """
    db_cart = models.cart.Cart(user_id=user_id)
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

def add_item_to_cart(db: Session, cart: models.cart.Cart, variant_id: uuid.UUID, quantity: int) -> models.cart.Cart:
    """
    Add a product variant to a cart.
    If the item is already in the cart, its quantity is updated.
    """
    # Check if the item is already in the cart
    existing_item = db.query(models.cart.CartItem).filter(
        models.cart.CartItem.cart_id == cart.id,
        models.cart.CartItem.product_variant_id == variant_id
    ).first()

    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = models.cart.CartItem(
            cart_id=cart.id,
            product_variant_id=variant_id,
            quantity=quantity
        )
        db.add(new_item)

    db.commit()
    db.refresh(cart)
    return cart

def remove_item_from_cart(db: Session, cart: models.cart.Cart, item_id: uuid.UUID) -> Optional[models.cart.Cart]:
    """
    Remove an item from a cart.
    """
    item_to_delete = db.query(models.cart.CartItem).filter(
        models.cart.CartItem.id == item_id,
        models.cart.CartItem.cart_id == cart.id
    ).first()

    if item_to_delete:
        db.delete(item_to_delete)
        db.commit()
        db.refresh(cart)
        return cart

    return None