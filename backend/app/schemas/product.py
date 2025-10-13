import uuid
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from decimal import Decimal

# --- Product Variant Schemas ---
class ProductVariantBase(BaseModel):
    sku: Optional[str] = None
    price: Decimal = Field(..., max_digits=10, decimal_places=2)
    compare_at_price: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    stock: int = Field(..., ge=0)
    attributes: Dict[str, Any] # e.g., {"size": "M", "color": "blue"}

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariant(ProductVariantBase):
    id: uuid.UUID
    product: 'Product' # Add this line

    class Config:
        orm_mode = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    title: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    category_id: uuid.UUID
    is_published: bool = False

class ProductCreate(ProductBase):
    variants: List[ProductVariantCreate]

class Product(ProductBase):
    id: uuid.UUID
    variants: List[ProductVariant] = []

    class Config:
        orm_mode = True

# This is needed for forward references
ProductVariant.update_forward_refs()