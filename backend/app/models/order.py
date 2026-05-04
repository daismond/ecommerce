import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Numeric,
    String,
    DateTime,
    JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    status = Column(String, nullable=False, default="pending_payment") # e.g., pending_payment, processing, shipped, delivered, cancelled
    total_amount = Column(Numeric(10, 2), nullable=False)
    shipping_address = Column(JSON)
    billing_address = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product_variant = relationship("ProductVariant")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    provider = Column(String, nullable=False) # e.g., "stripe"
    provider_payment_id = Column(String, unique=True) # e.g., Stripe's PaymentIntent ID
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False) # e.g., "succeeded", "pending", "failed"
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="payments")