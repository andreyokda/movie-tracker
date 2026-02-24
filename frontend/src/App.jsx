import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import Login from './components/Login'
import Register from './components/Register'
import SearchPage from './pages/SearchPage'
import MyMovies from './pages/MyMovies'
import { getCurrentUser, logout } from './services/auth'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const userData = await getCurrentUser()
    setUser(userData)
    setLoading(false)
  }

  const handleLogin = () => {
    checkUser()
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  if (loading) {
    return <div className="text-center mt-5">Загрузка...</div>
  }

  return (
    <Router>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">🎬 Movie Tracker</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="/">Поиск</Nav.Link>
              {user && <Nav.Link href="/my-movies">Мои фильмы</Nav.Link>}
            </Nav>
            <Nav>
              {user ? (
                <>
                  <span className="navbar-text me-3">
                    Привет, {user.username}
                  </span>
                  <Button variant="outline-danger" onClick={handleLogout}>
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link href="/login">Вход</Nav.Link>
                  <Nav.Link href="/register">Регистрация</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<SearchPage user={user} />} />
          <Route 
            path="/my-movies" 
            element={user ? <MyMovies user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Register onRegister={handleLogin} />} 
          />
        </Routes>
      </Container>
    </Router>
  )
}

export default App