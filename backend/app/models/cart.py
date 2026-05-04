import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    DateTime,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base
from sqlalchemy import Numeric

class Cart(Base):
    __tablename__ = "carts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    coupon_id = Column(UUID(as_uuid=True), ForeignKey("coupons.id"), nullable=True)
    discount_amount = Column(Numeric(10, 2), nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")
    coupon = relationship("Coupon")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Cart {self.id}>"

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_id = Column(UUID(as_uuid=True), ForeignKey("carts.id"), nullable=False)
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)

    cart = relationship("Cart", back_populates="items")
    product_variant = relationship("ProductVariant")

    def __repr__(self):
        return f"<CartItem cart_id={self.cart_id} variant_id={self.product_variant_id} quantity={self.quantity}>"