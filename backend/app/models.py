from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    year = Column(String)
    imdb_id = Column(String, unique=True, index=True)
    poster = Column(String, nullable=True)
    plot = Column(Text, nullable=True)