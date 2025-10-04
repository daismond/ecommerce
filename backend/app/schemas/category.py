import uuid
from pydantic import BaseModel
from typing import List, Optional

# Base schema for a category
class CategoryBase(BaseModel):
    name: str
    slug: str
    parent_id: Optional[uuid.UUID] = None

# Schema for creating a category (input)
class CategoryCreate(CategoryBase):
    pass

# Schema for reading a category (output)
class Category(CategoryBase):
    id: uuid.UUID
    children: List['Category'] = [] # Forward reference for self-referencing model

    class Config:
        orm_mode = True

# This is needed to update the forward reference
Category.update_forward_refs()