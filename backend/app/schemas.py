from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class MovieBase(BaseModel):
    title: str
    year: str
    imdb_id: str
    poster: Optional[str] = None
    plot: Optional[str] = None

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int

    class Config:
        from_attributes = True

class SavedMovieCreate(BaseModel):
    movie: MovieCreate
    rating: Optional[int] = None

class SavedMovie(BaseModel):
    id: int
    user_id: int
    movie_id: int
    rating: Optional[int] = None
    movie: Movie

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None