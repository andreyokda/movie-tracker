import httpx
import os
from dotenv import load_dotenv

load_dotenv()

KINOPOISK_API_KEY = os.getenv("KINOPOISK_API_KEY")
KINOPOISK_BASE_URL = "https://kinopoiskapiunofficial.tech/api"

async def search_movies(query: str):
    """Поиск фильмов по названию на русском"""
    if not KINOPOISK_API_KEY:
        return {"error": "Kinopoisk API key not configured"}
    
    headers = {
        "X-API-KEY": KINOPOISK_API_KEY,
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        params = {
            "keyword": query,
            "page": 1
        }
        
        response = await client.get(
            f"{KINOPOISK_BASE_URL}/v2.1/films/search-by-keyword",
            headers=headers,
            params=params
        )
        
        if response.status_code != 200:
            return []
        
        data = response.json()
        films = data.get("films", [])
        
        # Преобразуем в формат похожий на OMDb
        results = []
        for film in films:
            results.append({
                "Title": film.get("nameRu") or film.get("nameEn", "Unknown"),
                "Year": film.get("year", "N/A"),
                "imdbID": f"kp_{film.get('filmId')}",  # Кинопоиск ID
                "Type": "movie",
                "Poster": film.get("posterUrl", "N/A"),
                "Plot": film.get("description", ""),
                "rating": film.get("rating", "N/A")
            })
        
        return results

async def get_movie_by_id(kp_id: int):
    """Получить детальную информацию о фильме по ID Кинопоиска"""
    headers = {
        "X-API-KEY": KINOPOISK_API_KEY,
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{KINOPOISK_BASE_URL}/v2.2/films/{kp_id}",
            headers=headers
        )
        
        if response.status_code != 200:
            return None
            
        return response.json()