import uuid
from pydantic import BaseModel
from typing import List, Optional

from .product import ProductVariant # Import for nested schema

class CartItemBase(BaseModel):
    product_variant_id: uuid.UUID
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: uuid.UUID
    product_variant: ProductVariant # Nested schema to show variant details

    class Config:
        orm_mode = True

class Cart(BaseModel):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    items: List[CartItem] = []

    class Config:
        orm_mode = True