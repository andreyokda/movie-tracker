from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Связь с сохраненными фильмами
    saved_movies = relationship("SavedMovie", back_populates="user")

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    year = Column(String)
    imdb_id = Column(String, unique=True, index=True)
    poster = Column(String, nullable=True)
    plot = Column(String, nullable=True)
    
    # Связь с сохранениями
    saved_by_users = relationship("SavedMovie", back_populates="movie")

class SavedMovie(Base):
    __tablename__ = "saved_movies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))
    rating = Column(Integer, nullable=True)  # Оценка от 0 до 10
    
    # Связи
    user = relationship("User", back_populates="saved_movies")
    movie = relationship("Movie", back_populates="saved_by_users")