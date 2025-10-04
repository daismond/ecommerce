from fastapi import FastAPI
from .api.v1.endpoints import auth

app = FastAPI(title="E-commerce API")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the E-commerce API"}