import uuid
import enum
from typing import Optional
from pydantic import BaseModel, EmailStr

# This should match the UserRole enum in the models
class UserRole(str, enum.Enum):
    customer = "customer"
    admin = "admin"
    manager = "manager"

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
    role: UserRole

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None