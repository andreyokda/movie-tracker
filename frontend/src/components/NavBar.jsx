import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NavBar({ user, onLogout }) {
  return (
    <Navbar bg="light" expand="lg" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">🎬 Movie Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Поиск</Nav.Link>
            {user && <Nav.Link as={Link} to="/my-movies">Мои фильмы</Nav.Link>}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Привет, <strong>{user.username}</strong>!
                </Navbar.Text>
                <Button variant="outline-danger" onClick={onLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}