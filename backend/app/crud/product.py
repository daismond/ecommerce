from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from .. import models, schemas

def create_product(db: Session, product: schemas.product.ProductCreate) -> models.product.Product:
    """
    Create a new product along with its variants.
    """
    # Create the product instance
    db_product = models.product.Product(
        title=product.title,
        slug=product.slug,
        short_description=product.short_description,
        description=product.description,
        category_id=product.category_id,
        is_published=product.is_published
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    # Create and associate variants
    for variant_data in product.variants:
        db_variant = models.product.ProductVariant(
            product_id=db_product.id,
            **variant_data.dict()
        )
        db.add(db_variant)

    db.commit()
    db.refresh(db_product)
    return db_product

def get_product(db: Session, product_id: uuid.UUID) -> Optional[models.product.Product]:
    """
    Get a single product by its ID, including its variants.
    """
    return db.query(models.product.Product).filter(models.product.Product.id == product_id).first()

def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[uuid.UUID] = None
) -> List[models.product.Product]:
    """
    Get a list of products, with optional filtering by category.
    """
    query = db.query(models.product.Product)
    if category_id:
        query = query.filter(models.product.Product.category_id == category_id)
    return query.offset(skip).limit(limit).all()

def update_product(db: Session, product_id: uuid.UUID, product_update: schemas.product.ProductCreate) -> Optional[models.product.Product]:
    """
    Update an existing product.
    Note: This is a simplified update that replaces variants. A more robust
    implementation would handle individual variant updates.
    """
    db_product = get_product(db, product_id)
    if not db_product:
        return None

    # Update product fields
    update_data = product_update.dict(exclude_unset=True, exclude={'variants'})
    for key, value in update_data.items():
        setattr(db_product, key, value)

    # Delete old variants
    for variant in db_product.variants:
        db.delete(variant)

    # Create new variants
    for variant_data in product_update.variants:
        db_variant = models.product.ProductVariant(
            product_id=db_product.id,
            **variant_data.dict()
        )
        db.add(db_variant)

    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: uuid.UUID) -> Optional[models.product.Product]:
    """
    Delete a product and its variants (handled by cascade).
    """
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product