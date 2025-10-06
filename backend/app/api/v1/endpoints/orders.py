from fastapi import APIRouter, Depends
import uuid
from sqlalchemy.orm import Session
from typing import List

from app import crud, models, schemas
from app.api.v1.dependencies import get_db, get_current_active_user

router = APIRouter()

@router.get("/me", response_model=List[schemas.order.Order])
def read_user_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Retrieve all orders for the current logged-in user.
    """
    return crud.order.get_orders_by_user(db, user_id=current_user.id)

@router.get("/{order_id}", response_model=schemas.order.Order)
def read_user_order(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Retrieve a single order by ID for the current logged-in user.
    Ensures a user can only access their own orders.
    """
    order = crud.order.get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    return order