import { useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { login } from '../services/auth'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="auth-card">
      <Card.Header>
        <h2>Добро пожаловать!</h2>
        <p className="mb-0">Войдите в свой аккаунт</p>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Введите имя пользователя"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
            />
          </Form.Group>

          <Button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Link to="/register">Нет аккаунта? Зарегистрируйтесь</Link>
        </div>
      </Card.Body>
    </Card>
  )
}