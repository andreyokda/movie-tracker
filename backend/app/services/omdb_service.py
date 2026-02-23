import httpx
import os
from dotenv import load_dotenv

load_dotenv()

OMDB_API_KEY = os.getenv("OMDB_API_KEY")
OMDB_BASE_URL = "http://www.omdbapi.com/"

async def search_movies(query: str):
    """Поиск фильмов по названию"""
    async with httpx.AsyncClient() as client:
        params = {
            "apikey": OMDB_API_KEY,
            "s": query,
            "type": "movie"
        }
        response = await client.get(OMDB_BASE_URL, params=params)
        data = response.json()
        
        if data.get("Response") == "True":
            return data.get("Search", [])
        return []

async def get_movie_by_id(imdb_id: str):
    """Получить детальную информацию о фильме по IMDB ID"""
    async with httpx.AsyncClient() as client:
        params = {
            "apikey": OMDB_API_KEY,
            "i": imdb_id,
            "plot": "full"
        }
        response = await client.get(OMDB_BASE_URL, params=params)
        data = response.json()
        
        if data.get("Response") == "True":
            return data
        return None