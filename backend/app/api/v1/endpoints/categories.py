from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
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

@router.get("/", response_model=List[schemas.category.Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all categories.
    """
    categories = crud.category.get_categories(db, skip=skip, limit=limit)
    return categories

@router.get("/{category_id}", response_model=schemas.category.Category)
def read_category(category_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Retrieve a single category by its ID.
    """
    db_category = crud.category.get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return db_category