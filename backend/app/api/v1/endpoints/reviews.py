from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app import crud, models, schemas
from app.api.v1.dependencies import get_db, get_current_active_user

router = APIRouter()

@router.get("/products/{product_id}/reviews", response_model=List[schemas.review.Review])
def read_product_reviews(
    product_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all reviews for a specific product.
    """
    reviews = crud.review.get_reviews_by_product(db, product_id=str(product_id), skip=skip, limit=limit)
    return reviews

@router.post("/products/{product_id}/reviews", response_model=schemas.review.Review, status_code=status.HTTP_201_CREATED)
def create_product_review(
    product_id: uuid.UUID,
    review: schemas.review.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_active_user)
):
    """
    Create a new review for a product. Must be a logged-in user.
    A user can only review a product once (this logic can be added later).
    """
    # Optional: Check if user has already reviewed this product
    # existing_review = ...
    # if existing_review:
    #     raise HTTPException(status_code=400, detail="You have already reviewed this product.")

    return crud.review.create_review(db=db, review=review, product_id=str(product_id), user_id=str(current_user.id))