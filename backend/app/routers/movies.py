from fastapi import APIRouter, HTTPException
from app.services import omdb_service

router = APIRouter(prefix="/api/movies", tags=["movies"])

@router.get("/search")
async def search_movies(q: str):
    """Поиск фильмов по названию"""
    if not q or len(q) < 2:
        return {"results": []}
    
    results = await omdb_service.search_movies(q)
    return {"results": results}

@router.get("/{imdb_id}")
async def get_movie(imdb_id: str):
    """Получить детальную информацию о фильме"""
    movie = await omdb_service.get_movie_by_id(imdb_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie