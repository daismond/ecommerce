from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .... import crud, models, schemas
from ....core import security
from ....database import SessionLocal

router = APIRouter()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.user.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.user.UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    """
    db_user = crud.user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return crud.user.create_user(db=db, user=user)


@router.post("/login", response_model=schemas.token.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """
    Authenticate user and return a JWT access token.
    """
    user = crud.user.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}