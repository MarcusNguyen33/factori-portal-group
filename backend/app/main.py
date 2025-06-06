from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


import debugpy

from .routers import items, locations, suppliers, inventory, transactions, records

# so vsc can attach
debugpy.listen(("0.0.0.0", 5678))
print("waiting for debugger to attach...")
debugpy.wait_for_client()


app = FastAPI(title="FactoriPortal API")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include more routers later
# the /api/v1/items is a convention. 'v1' is good to have because if in the
# future we wanted to change the items api we could just do 'v2' without
# effecting the 'v1' routes, or also for testing.
#
# app.include basically registeres all the indivitual routes like @app.get
# or @app.post from the routers directory with the main `app` instance.
#
# the 'tags=["items"] part is for FastAPI's automatic documentation.
# it basically groups all the routes from items.router under a heading
# called "items" in the documentation. so we'd have different tags for
# different sections/relations for organization.
app.include_router(items.router, prefix="/api/v1/items", tags=["items"])

app.include_router(locations.router, prefix="/api/v1/locations", tags=["locations"])

app.include_router(suppliers.router, prefix="/api/v1/suppliers", tags=["suppliers"])

app.include_router(inventory.router, prefix="/api/v1/inventory", tags=["inventory"])

app.include_router(
    transactions.router, prefix="/api/v1/transactions", tags=["transactions"]
)

app.include_router(records.router, prefix="/api/v1/records", tags=["records"])


# the decorator tells FastAPI that when an HTTP GET request comes in for
# the route path "/" of the application, execute the `read_route` function
# and use its return value to form the response.
# so the function and the decorator route get linked.
@app.get("/")
async def read_root():
    return {"message": "Welcome to FactoriPortal API!"}


@app.get("/test")
async def test():
    return {"message": "response!"}
