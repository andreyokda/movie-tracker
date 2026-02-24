import httpx
import os
from dotenv import load_dotenv
from . import translit

load_dotenv()

OMDB_API_KEY = os.getenv("OMDB_API_KEY")
OMDB_BASE_URL = "http://www.omdbapi.com/"

async def search_movies(query: str):
    """Поиск фильмов по названию"""
    if not OMDB_API_KEY:
        return {"error": "OMDb API key not configured"}
    
    async with httpx.AsyncClient() as client:
        # Пробуем оригинальный запрос
        params = {
            "apikey": OMDB_API_KEY,
            "s": query,
            "type": "movie"
        }
        
        response = await client.get(OMDB_BASE_URL, params=params)
        data = response.json()
        
        if data.get("Response") == "True":
            return data.get("Search", [])
        
        # Если не нашли и запрос на русском - пробуем транслит
        if any('а' <= c <= 'я' for c in query.lower()):
            eng_query = translit.rus_to_eng(query)
            params["s"] = eng_query
            response = await client.get(OMDB_BASE_URL, params=params)
            data = response.json()
            
            if data.get("Response") == "True":
                return data.get("Search", [])
        
        return []