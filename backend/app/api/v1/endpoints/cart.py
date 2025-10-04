from fastapi import APIRouter, Depends, HTTPException, status, Header, Response
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app import crud, models, schemas
from app.api.v1.dependencies import get_db, get_current_user_optional

router = APIRouter()

# Dependency to get or create a cart for either a guest or a logged-in user
def get_or_create_cart(
    response: Response,
    cart_id: Optional[uuid.UUID] = Header(None, alias="X-Cart-ID"),
    db: Session = Depends(get_db),
    current_user: Optional[models.user.User] = Depends(get_current_user_optional)
) -> models.cart.Cart:
    cart = None
    # 1. If user is logged in, try to get their cart
    if current_user:
        cart = crud.cart.get_cart(db, user_id=current_user.id)

    # 2. If no user cart, try to get guest cart from header
    if not cart and cart_id:
        cart = crud.cart.get_cart(db, cart_id=cart_id)

    # 3. If still no cart, create a new one
    if not cart:
        user_id_to_assign = current_user.id if current_user else None
        cart = crud.cart.create_cart(db, user_id=user_id_to_assign)

    # 4. Associate guest cart with user if they just logged in
    if current_user and cart.user_id is None:
        cart.user_id = current_user.id
        db.commit()
        db.refresh(cart)

    # Always return the cart ID in the response header
    response.headers["X-Cart-ID"] = str(cart.id)
    return cart

@router.get("/", response_model=schemas.cart.Cart)
def get_cart_endpoint(cart: models.cart.Cart = Depends(get_or_create_cart)):
    """
    Get the current shopping cart for a guest or logged-in user.
    """
    return cart

@router.post("/items", response_model=schemas.cart.Cart)
def add_item_to_cart(
    item: schemas.cart.CartItemCreate,
    cart: models.cart.Cart = Depends(get_or_create_cart),
    db: Session = Depends(get_db)
):
    """
    Add an item to the shopping cart.
    """
    # Future enhancement: check product variant stock before adding
    updated_cart = crud.cart.add_item_to_cart(db, cart=cart, variant_id=item.product_variant_id, quantity=item.quantity)
    return updated_cart

@router.delete("/items/{item_id}", response_model=schemas.cart.Cart)
def remove_item_from_cart(
    item_id: uuid.UUID,
    cart: models.cart.Cart = Depends(get_or_create_cart),
    db: Session = Depends(get_db)
):
    """
    Remove an item from the shopping cart.
    """
    updated_cart = crud.cart.remove_item_from_cart(db, cart=cart, item_id=item_id)
    if updated_cart is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in cart")

    return updated_cart