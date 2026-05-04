from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from .. import models, schemas

def create_coupon(db: Session, coupon: schemas.coupon.CouponCreate) -> models.coupon.Coupon:
    """Create a new coupon."""
    db_coupon = models.coupon.Coupon(**coupon.dict())
    db.add(db_coupon)
    db.commit()
    db.refresh(db_coupon)
    return db_coupon

def get_coupons(db: Session, skip: int = 0, limit: int = 100) -> List[models.coupon.Coupon]:
    """Get a list of all coupons."""
    return db.query(models.coupon.Coupon).offset(skip).limit(limit).all()

def get_coupon_by_code(db: Session, code: str) -> Optional[models.coupon.Coupon]:
    """Get a coupon by its code."""
    return db.query(models.coupon.Coupon).filter(models.coupon.Coupon.code == code).first()

def is_coupon_valid(coupon: models.coupon.Coupon) -> bool:
    """Check if a coupon is currently valid."""
    now = datetime.utcnow()
    if coupon.valid_to and coupon.valid_to < now:
        return False
    if coupon.used_count >= coupon.usage_limit:
        return False
    return True

def update_coupon(db: Session, coupon_id: uuid.UUID, coupon_update: schemas.coupon.CouponUpdate) -> Optional[models.coupon.Coupon]:
    """Update an existing coupon."""
    db_coupon = db.query(models.coupon.Coupon).filter(models.coupon.Coupon.id == coupon_id).first()
    if db_coupon:
        update_data = coupon_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_coupon, key, value)
        db.commit()
        db.refresh(db_coupon)
    return db_coupon

def delete_coupon(db: Session, coupon_id: uuid.UUID) -> Optional[models.coupon.Coupon]:
    """Delete a coupon."""
    db_coupon = db.query(models.coupon.Coupon).filter(models.coupon.Coupon.id == coupon_id).first()
    if db_coupon:
        db.delete(db_coupon)
        db.commit()
    return db_coupon

def increment_coupon_usage(db: Session, coupon_code: str):
    """Increment the usage count of a coupon."""
    coupon = get_coupon_by_code(db, coupon_code)
    if coupon:
        coupon.used_count += 1
        db.commit()
        db.refresh(coupon)
    return coupon