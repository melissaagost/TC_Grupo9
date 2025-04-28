import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth'

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    correo: email,
    password,
  })
  return response.data
}
