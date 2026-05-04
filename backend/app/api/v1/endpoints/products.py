from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app import crud, schemas
from app.database import SessionLocal

router = APIRouter()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.product.Product])
def read_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[uuid.UUID] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve products.

    This public endpoint lists products with optional filtering by category and search.
    """
    products = crud.product.get_products(db, skip=skip, limit=limit, category_id=category_id, search_query=search)
    return products

@router.get("/{product_id}", response_model=schemas.product.Product)
def read_product(product_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Retrieve a single product by its ID.
    """
    db_product = crud.product.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return db_product