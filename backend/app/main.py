from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.endpoints import auth, products, categories, admin, cart, checkout, webhooks, users, orders, reports, reviews

app = FastAPI(title="E-commerce API")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(reviews.router, prefix="/api/v1", tags=["Reviews"]) # Mounted at root for /products/...
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["Cart"])
app.include_router(checkout.router, prefix="/api/v1/checkout", tags=["Checkout"])
app.include_router(webhooks.router, prefix="/api/v1/webhooks", tags=["Webhooks"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(reports.router, prefix="/api/v1/admin/reports", tags=["Admin Reports"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the E-commerce API"}