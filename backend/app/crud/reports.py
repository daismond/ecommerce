from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Tuple

from .. import models

def get_sales_summary(db: Session) -> Tuple[float, int]:
    """
    Calculates total sales revenue and the total number of orders.
    Only considers orders that are not 'pending_payment' or 'cancelled'.
    """
    valid_statuses = ["processing", "shipped", "delivered"]

    total_revenue = db.query(func.sum(models.order.Order.total_amount)).filter(
        models.order.Order.status.in_(valid_statuses)
    ).scalar() or 0.0

    total_orders = db.query(func.count(models.order.Order.id)).filter(
        models.order.Order.status.in_(valid_statuses)
    ).scalar() or 0

    return float(total_revenue), total_orders

def get_top_selling_products(db: Session, limit: int = 5) -> List[Tuple[models.product.Product, int]]:
    """
    Gets the top-selling products based on the quantity sold across all orders.
    """
    return db.query(
        models.product.Product,
        func.sum(models.order.OrderItem.quantity).label('total_quantity_sold')
    ).join(
        models.order.OrderItem, models.order.OrderItem.product_variant_id == models.product.ProductVariant.id
    ).join(
        models.product.Product, models.product.ProductVariant.product_id == models.product.Product.id
    ).group_by(
        models.product.Product.id
    ).order_by(
        desc('total_quantity_sold')
    ).limit(limit).all()

def get_critical_stock_products(db: Session, threshold: int = 10, limit: int = 10) -> List[models.product.ProductVariant]:
    """
    Gets product variants with stock at or below a certain threshold.
    """
    return db.query(models.product.ProductVariant).filter(
        models.product.ProductVariant.stock <= threshold
    ).order_by(
        models.product.ProductVariant.stock.asc()
    ).limit(limit).all()