from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import crud, models, schemas
from app.api.v1.dependencies import get_db, get_current_admin_user

router = APIRouter()

@router.get("/summary", response_model=schemas.reports.SalesSummary)
def get_sales_summary(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    """
    Get a summary of total sales revenue and number of orders.
    """
    total_revenue, total_orders = crud.reports.get_sales_summary(db)
    return {"total_revenue": total_revenue, "total_orders": total_orders}

@router.get("/top-selling", response_model=List[schemas.reports.TopSellingProduct])
def get_top_selling_products(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    """
    Get the top 5 best-selling products.
    """
    top_products_data = crud.reports.get_top_selling_products(db, limit=5)
    # Manually construct the Pydantic model from the tuple returned by the query
    return [
        schemas.reports.TopSellingProduct(
            product=product,
            total_quantity_sold=quantity
        ) for product, quantity in top_products_data
    ]

@router.get("/critical-stock", response_model=List[schemas.product.ProductVariant])
def get_critical_stock_products(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    """
    Get product variants with stock at or below the threshold of 10.
    """
    return crud.reports.get_critical_stock_products(db, threshold=10, limit=10)