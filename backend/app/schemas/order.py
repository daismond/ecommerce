import uuid
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from decimal import Decimal
from .product import ProductVariant

class OrderItem(BaseModel):
    id: uuid.UUID
    product_variant_id: uuid.UUID
    quantity: int
    unit_price: Decimal
    product_variant: ProductVariant

    class Config:
        orm_mode = True

class Order(BaseModel):
    id: uuid.UUID
    order_number: str
    status: str
    total_amount: Decimal
    shipping_address: Dict[str, Any]
    items: List[OrderItem]

    class Config:
        orm_mode = True

class CheckoutSessionCreate(BaseModel):
    shipping_address: Dict[str, Any]

class CheckoutSession(BaseModel):
    client_secret: str
    order_id: uuid.UUID