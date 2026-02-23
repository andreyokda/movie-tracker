from fastapi import FastAPI
from app.database import engine
from app import models
from app.routers import movies

# Создаем таблицы в базе данных
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Tracker API")

# Подключаем роутеры
app.include_router(movies.router)

@app.get("/")
def root():
    return {"message": "Movie Tracker API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "database": "connected"}