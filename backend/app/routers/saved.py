from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models, auth
from app.database import get_db

router = APIRouter(prefix="/api/saved", tags=["saved"])

@router.post("/movies")
async def save_movie(
    movie_data: schemas.SavedMovieCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Проверяем есть ли фильм в базе
    movie = db.query(models.Movie).filter(
        models.Movie.imdb_id == movie_data.movie.imdb_id
    ).first()
    
    # Если нет - создаем
    if not movie:
        movie = models.Movie(
            title=movie_data.movie.title,
            year=movie_data.movie.year,
            imdb_id=movie_data.movie.imdb_id,
            poster=movie_data.movie.poster,
            plot=movie_data.movie.plot
        )
        db.add(movie)
        db.commit()
        db.refresh(movie)
    
    # Проверяем не сохранял ли пользователь уже этот фильм
    saved = db.query(models.SavedMovie).filter(
        models.SavedMovie.user_id == current_user.id,
        models.SavedMovie.movie_id == movie.id
    ).first()
    
    if saved:
        # Если уже сохранял - обновляем рейтинг
        saved.rating = movie_data.rating
    else:
        # Если нет - создаем запись
        saved = models.SavedMovie(
            user_id=current_user.id,
            movie_id=movie.id,
            rating=movie_data.rating
        )
        db.add(saved)
    
    db.commit()
    return {"success": True, "message": "Movie saved"}

@router.get("/movies")
async def get_saved_movies(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    saved = db.query(models.SavedMovie).filter(
        models.SavedMovie.user_id == current_user.id
    ).all()
    return saved

@router.delete("/movies/{movie_id}")
async def delete_saved_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    saved = db.query(models.SavedMovie).filter(
        models.SavedMovie.user_id == current_user.id,
        models.SavedMovie.movie_id == movie_id
    ).first()
    
    if saved:
        db.delete(saved)
        db.commit()
        return {"success": True}
    
    raise HTTPException(status_code=404, detail="Movie not found")