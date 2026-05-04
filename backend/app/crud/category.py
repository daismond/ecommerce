from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from .. import models, schemas

def create_category(db: Session, category: schemas.category.CategoryCreate) -> models.category.Category:
    """
    Create a new category.
    """
    db_category = models.category.Category(
        name=category.name,
        slug=category.slug,
        parent_id=category.parent_id
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_category(db: Session, category_id: uuid.UUID) -> Optional[models.category.Category]:
    """
    Get a single category by its ID.
    """
    return db.query(models.category.Category).filter(models.category.Category.id == category_id).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[models.category.Category]:
    """
    Get a list of all categories.
    """
    return db.query(models.category.Category).offset(skip).limit(limit).all()

def update_category(db: Session, category_id: uuid.UUID, category_update: schemas.category.CategoryCreate) -> Optional[models.category.Category]:
    """
    Update an existing category.
    """
    db_category = get_category(db, category_id)
    if db_category:
        update_data = category_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: uuid.UUID) -> Optional[models.category.Category]:
    """
    Delete a category.
    """
    db_category = get_category(db, category_id)
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category