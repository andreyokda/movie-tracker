const API_URL = 'http://127.0.0.1:8000/api'

export const register = async (username, email, password) => {
  console.log('Registering:', { username, email, password })
  
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
  
  const data = await response.json()
  console.log('Response:', data)
  
  // Если регистрация успешна - автоматически логинимся
  if (data.success) {
    // Пробуем залогиниться с теми же данными
    return await login(username, password)
  }
  
  throw new Error(data.error || 'Registration failed')
}

export const login = async (username, password) => {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)
  
  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })
  
  const data = await response.json()
  localStorage.setItem('token', data.access_token)
  return data
}

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  
  if (!response.ok) {
    localStorage.removeItem('token')
    return null
  }
  
  return response.json()
}

export const logout = () => {
  localStorage.removeItem('token')
}