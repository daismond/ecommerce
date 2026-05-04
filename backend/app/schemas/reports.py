from pydantic import BaseModel
from typing import List
from .product import Product, ProductVariant

class SalesSummary(BaseModel):
    total_revenue: float
    total_orders: int

class TopSellingProduct(BaseModel):
    product: Product
    total_quantity_sold: int

    class Config:
        orm_mode = True

class CriticalStockProduct(BaseModel):
    variant: ProductVariant

    class Config:
        orm_mode = True