const API_URL = 'http://127.0.0.1:8000/api'

export const searchMovies = async (query) => {
  if (!query.trim()) return []
  
  const response = await fetch(`${API_URL}/movies/search?q=${query}`)
  const data = await response.json()
  return data.results || []
}

export const getMovieById = async (imdbId) => {
  const response = await fetch(`${API_URL}/movies/${imdbId}`)
  return response.json()
}

export const saveMovie = async (movieData, rating = null) => {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}/saved/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      movie: {
        title: movieData.Title,
        year: movieData.Year,
        imdb_id: movieData.imdbID,
        poster: movieData.Poster,
        plot: movieData.Plot,
      },
      rating: rating,
    }),
  })
  
  return response.json()
}

export const getSavedMovies = async () => {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}/saved/movies`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  
  return response.json()
}

export const getMovieByDbId = async (movieId) => {
  const response = await fetch(`${API_URL}/movies/id/${movieId}`)
  return response.json()
}