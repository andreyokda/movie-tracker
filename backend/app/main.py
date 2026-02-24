from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routers import movies, auth, saved

# Создаем таблицы
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Tracker API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
app.include_router(movies.router)
app.include_router(auth.router)
app.include_router(saved.router)

@app.get("/")
def root():
    return {"message": "Movie Tracker API"}

@app.get("/api/health")
def health():
    return {"status": "ok"}