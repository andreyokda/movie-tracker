from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services import kinopoisk_service  # поменяли на кинопоиск
from app.database import get_db
from app import models

router = APIRouter(prefix="/api/movies", tags=["movies"])

@router.get("/search")
async def search_movies(q: str):
    """Поиск фильмов по названию"""
    if not q or len(q) < 2:
        return {"results": []}
    
    results = await kinopoisk_service.search_movies(q)
    return {"results": results}

@router.get("/id/{movie_id}")
async def get_movie_by_db_id(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie