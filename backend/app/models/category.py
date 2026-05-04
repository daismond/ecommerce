import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)

    parent_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent")

    products = relationship("Product", back_populates="category")

    def __repr__(self):
        return f"<Category {self.name}>"