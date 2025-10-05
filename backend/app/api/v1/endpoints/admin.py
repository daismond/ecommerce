from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from app import crud, models, schemas
from app.api.v1.dependencies import get_db, get_current_admin_user

router = APIRouter()

# --- Admin Product Management ---

@router.post("/products/", response_model=schemas.product.Product, status_code=status.HTTP_201_CREATED)
def create_product(
    product: schemas.product.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    return crud.product.create_product(db=db, product=product)

@router.put("/products/{product_id}", response_model=schemas.product.Product)
def update_product(
    product_id: uuid.UUID,
    product_update: schemas.product.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    db_product = crud.product.update_product(db, product_id=product_id, product_update=product_update)
    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return db_product

@router.delete("/products/{product_id}", response_model=schemas.product.Product)
def delete_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    db_product = crud.product.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return db_product

# --- Admin Category Management ---

@router.post("/categories/", response_model=schemas.category.Category, status_code=status.HTTP_201_CREATED)
def create_category(
    category: schemas.category.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    return crud.category.create_category(db=db, category=category)

@router.put("/categories/{category_id}", response_model=schemas.category.Category)
def update_category(
    category_id: uuid.UUID,
    category_update: schemas.category.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    db_category = crud.category.update_category(db, category_id=category_id, category_update=category_update)
    if db_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return db_category

@router.delete("/categories/{category_id}", response_model=schemas.category.Category)
def delete_category(
    category_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    db_category = crud.category.delete_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return db_category

# --- Admin Order Management ---

@router.get("/orders/", response_model=list[schemas.order.Order])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    orders = crud.order.get_orders(db, skip=skip, limit=limit)
    return orders

@router.get("/orders/{order_id}", response_model=schemas.order.Order)
def read_order(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    db_order = crud.order.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return db_order

@router.patch("/orders/{order_id}", response_model=schemas.order.Order)
def update_order_status(
    order_id: uuid.UUID,
    status_update: schemas.order.OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_admin_user)
):
    updated_order = crud.order.update_order_status(db, order_id=order_id, status=status_update.status)
    if updated_order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return updated_order