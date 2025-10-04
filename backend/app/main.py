from fastapi import FastAPI
from .api.v1.endpoints import auth, products, categories, admin, cart, checkout, webhooks, users

app = FastAPI(title="E-commerce API")

# API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["Cart"])
app.include_router(checkout.router, prefix="/api/v1/checkout", tags=["Checkout"])
app.include_router(webhooks.router, prefix="/api/v1/webhooks", tags=["Webhooks"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the E-commerce API"}