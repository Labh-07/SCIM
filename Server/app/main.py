from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import login_register_routes,admin_routes,society_and_service_routes
from contextlib import asynccontextmanager
from app.config.database import engine,Base

#lifecycle
@asynccontextmanager
async def lifespan(_app:FastAPI):
    #startup 
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    #shutdown
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

#cross midllware
origins = [
    "http://localhost:5173",  # Default Vite port
    "http://localhost:3000",  # Default Create-React-App port
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],  # Allows all headers
)


app.include_router(login_register_routes.router ,prefix="/api/auth", tags=["Login"])
app.include_router(admin_routes.router , prefix="/api/admin" , tags=["Admin"])
app.include_router(society_and_service_routes.router , prefix="/api/society" , tags=["Society & Service"])

@app.get("/")
async def home():
    return {"message" : "hello i am labh :)"}

