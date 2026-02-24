import { useState } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { saveMovie } from '../services/api'

export default function MovieCard({ movie, user, onDelete }) {
  const [rating, setRating] = useState(0)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!user) {
      alert('Войдите, чтобы сохранять фильмы')
      return
    }
    
    setSaving(true)
    try {
      await saveMovie(movie, rating || null)
      alert('Фильм сохранен!')
    } catch (error) {
      alert('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="h-100">
      {movie.Poster && movie.Poster !== 'N/A' ? (
        <Card.Img 
          variant="top" 
          src={movie.Poster} 
          style={{ height: '300px', objectFit: 'cover' }}
        />
      ) : (
        <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
          Нет постера
        </div>
      )}
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>Год: {movie.Year}</Card.Text>
        
        {user && !onDelete && (
          <>
            <Form.Select 
              size="sm" 
              className="mb-2"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="0">Без оценки</option>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Form.Select>
            
            <Button 
              variant="primary" 
              size="sm"
              className="w-100"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </>
        )}
        
        {onDelete && (
          <Button 
            variant="danger" 
            size="sm"
            className="w-100"
            onClick={() => onDelete(movie)}
          >
            Удалить
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}