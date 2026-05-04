import uuid
import enum
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Numeric,
    DateTime,
    Integer,
    Enum as SAEnum,
)
from sqlalchemy.dialects.postgresql import UUID
from ..database import Base

class DiscountType(str, enum.Enum):
    percent = "percent"
    fixed = "fixed"

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, unique=True, index=True, nullable=False)
    discount_type = Column(SAEnum(DiscountType), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)

    valid_from = Column(DateTime, default=datetime.utcnow)
    valid_to = Column(DateTime, nullable=True)

    usage_limit = Column(Integer, default=1)
    used_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Coupon {self.code}>"