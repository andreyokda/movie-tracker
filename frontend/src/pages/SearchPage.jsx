import { useState } from 'react'
import { Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { searchMovies } from '../services/api'
import MovieCard from '../components/MovieCard'

export default function SearchPage({ user }) {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const results = await searchMovies(query)
      setMovies(results)
      if (results.length === 0) {
        setError('Ничего не найдено')
      }
    } catch (err) {
      setError('Ошибка при поиске')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-center mb-4">Поиск фильмов</h1>
      
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Form onSubmit={handleSearch}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введите название фильма..."
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Поиск'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {error && <Alert variant="warning">{error}</Alert>}

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {movies.map((movie) => (
          <Col key={movie.imdbID}>
            <MovieCard movie={movie} user={user} />
          </Col>
        ))}
      </Row>
    </div>
  )
}