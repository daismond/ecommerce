from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas

def create_review(db: Session, review: schemas.review.ReviewCreate, product_id: str, user_id: str) -> models.review.ProductReview:
    """
    Create a new product review.
    """
    db_review = models.review.ProductReview(
        product_id=product_id,
        user_id=user_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_by_product(db: Session, product_id: str, skip: int = 0, limit: int = 100) -> List[models.review.ProductReview]:
    """
    Get all reviews for a specific product.
    """
    return db.query(models.review.ProductReview).filter(
        models.review.ProductReview.product_id == product_id
    ).order_by(
        models.review.ProductReview.created_at.desc()
    ).offset(skip).limit(limit).all()