import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Text,
    DateTime,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base

class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    rating = Column(Integer, nullable=False) # Rating from 1 to 5
    comment = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product")
    user = relationship("User")

    def __repr__(self):
        return f"<ProductReview product_id={self.product_id} user_id={self.user_id} rating={self.rating}>"