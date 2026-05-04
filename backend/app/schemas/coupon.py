import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from ..models.coupon import DiscountType

class CouponBase(BaseModel):
    code: str = Field(..., min_length=3, max_length=50)
    discount_type: DiscountType
    amount: float = Field(..., gt=0)
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    usage_limit: int = Field(1, gt=0)

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=3, max_length=50)
    amount: Optional[float] = Field(None, gt=0)
    valid_to: Optional[datetime] = None
    usage_limit: Optional[int] = Field(None, gt=0)

class Coupon(CouponBase):
    id: uuid.UUID
    used_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True