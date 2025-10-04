import uuid
from pydantic import BaseModel, EmailStr

# Schema for user creation (input)
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str | None = None
    last_name: str | None = None

# Schema for reading user data (output)
class User(BaseModel):
    id: uuid.UUID
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    is_active: bool

    class Config:
        orm_mode = True