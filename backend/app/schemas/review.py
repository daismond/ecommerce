import uuid
from datetime import datetime
from pydantic import BaseModel, constr, conint

# A simplified User schema for displaying within a review
class UserInReview(BaseModel):
    first_name: str | None = None
    last_name: str | None = None

    class Config:
        orm_mode = True

class ReviewBase(BaseModel):
    rating: conint(ge=1, le=5) # Rating must be between 1 and 5
    comment: constr(max_length=1000) | None = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: uuid.UUID
    user: UserInReview
    created_at: datetime

    class Config:
        orm_mode = True