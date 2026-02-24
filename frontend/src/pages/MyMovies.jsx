import { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'
import { getSavedMovies, getMovieByDbId } from '../services/api'

export default function MyMovies({ user }) {
  const [savedMovies, setSavedMovies] = useState([])
  const [moviesDetails, setMoviesDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Получаем сохраненные фильмы
      const saved = await getSavedMovies()
      setSavedMovies(saved)
      
      // Для каждого сохраненного фильма получаем детали из нашей БД
      const details = {}
      for (const item of saved) {
        const movieData = await getMovieByDbId(item.movie_id)
        details[item.movie_id] = movieData
      }
      setMoviesDetails(details)
      
    } catch (err) {
      setError('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center mt-5"><Spinner /></div>

  return (
    <div className="py-4">
      <h1 className="text-center mb-4">Мои фильмы</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {savedMovies.length === 0 ? (
        <Alert variant="info">У вас пока нет сохраненных фильмов</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {savedMovies.map((saved) => {
            const movie = moviesDetails[saved.movie_id] || {}
            
            return (
              <Col key={saved.id}>
                <Card style={{ height: '100%' }}>
                  {movie.poster && movie.poster !== 'N/A' ? (
                    <Card.Img 
                      variant="top" 
                      src={movie.poster}
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      height: '300px', 
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      Нет постера
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title>{movie.title || `Фильм #${saved.movie_id}`}</Card.Title>
                    <Card.Text>
                      <strong>Год:</strong> {movie.year || 'Неизвестно'}<br />
                      <strong>Рейтинг:</strong> {saved.rating}/10
                    </Card.Text>
                    <Button variant="outline-danger" size="sm">
                      Удалить
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}
    </div>
  )
}