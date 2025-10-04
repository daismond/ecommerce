from fastapi import APIRouter, Depends

from app import models, schemas
from app.api.v1.dependencies import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=schemas.user.User)
def read_users_me(current_user: models.user.User = Depends(get_current_active_user)):
    """
    Get current user's profile.
    """
    return current_user