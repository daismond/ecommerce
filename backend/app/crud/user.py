from sqlalchemy.orm import Session
from .. import models, schemas
from ..core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    """
    Retrieves a user from the database by their email.
    """
    return db.query(models.user.User).filter(models.user.User.email == email).first()

def create_user(db: Session, user: schemas.user.UserCreate):
    """
    Creates a new user in the database.
    """
    hashed_password = get_password_hash(user.password)
    db_user = models.user.User(
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user