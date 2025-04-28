import { useState } from 'react'
import { login } from '../../services/authService.ts'
import { useAuth } from '../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { Button } from '../UI/Button'
import { Input } from '../UI/Input'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const AuthForms = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { setToken, setUserType, setIdRestaurante } = useAuth() // ⬅️ También el id_restaurante

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await login(email, password)
      const token = response.access_token

      setToken(token)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token)

      if (decoded?.rol) {
        setUserType(decoded.rol) //administrador" o "usuario"
      }

      if (decoded?.id_restaurante !== undefined) {
        setIdRestaurante(decoded.id_restaurante)
      }

      console.log('Login exitoso ✅')
      navigate('/')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error en login', error.response?.data?.message || error.message)
      } else {
        console.error('Error desconocido', error)
      }
    }
  }
  return (
    <div className="md:w-1/2 p-8 bg-eggshell-400 relative overflow-hidden">
      <div className="relative w-full" style={{ height: '500px' }}>
        {/* Login Form */}
        <div
          className={`absolute w-full transition-all duration-500 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-full opacity-0'}`}
        >
          <h2 className="text-3xl font-playfair font-semibold text-gray-700 mb-6">
            Bienvenido de Vuelta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 font-raleway">
            <div>
              <label className="text-sm text-charcoal-600 block mb-1">Email</label>
              <Input
                className="bg-pink-100 border-eggshell-creamy"
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-charcoal-600 block mb-1">Contraseña</label>
              <div className="relative">
                <Input
                  className="bg-pink-100 border-eggshell-creamy"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>

          {/* Link para Registro */}
          <p className="mt-6 text-center font-raleway text-charcoal-600">
            Nuevo aquí?{' '}
            <button
              onClick={() => setIsLogin(false)}
              className="text-blood-300 hover:underline font-semibold"
            >
              Registrate
            </button>
          </p>

          {/* Link para recuperar contraseña */}
          <p className="mt-6 text-sm text-center font-raleway text-gray-200">
            Olvidaste tu contraseña?{' '}
            <Link to="/building" className="text-gray-200 hover:underline font-semibold">
              Reestablecer
            </Link>
          </p>
        </div>

        {/* Register Form (Placeholder, sin funcionalidad real aún) */}
        <div
          className={`absolute w-full transition-all duration-500 ease-in-out ${!isLogin ? 'translate-x-0' : 'translate-x-full opacity-0'}`}
        >
          <h2 className="text-3xl font-playfair font-semibold text-gray-700 mb-6">
            Crea una Cuenta
          </h2>

          <form className="space-y-4 font-raleway">
            <div>
              <label className="text-sm text-charcoal-600 block mb-1">Nombre Completo</label>
              <Input
                className="bg-pink-100 border-eggshell-creamy"
                type="text"
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            <div>
              <label className="text-sm text-charcoal-600 block mb-1">Email</label>
              <Input
                className="bg-pink-100 border-eggshell-creamy"
                type="email"
                placeholder="Ingresa tu email"
              />
            </div>

            <div>
              <label className="text-sm text-charcoal-600 block mb-1">Contraseña</label>
              <div className="relative">
                <Input
                  className="bg-pink-100 border-eggshell-creamy"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Elige una contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="button" className="w-full">
              Crear Cuenta
            </Button>
          </form>

          <p className="mt-6 text-center font-raleway text-charcoal-600">
            Ya tienes una cuenta?{' '}
            <button
              onClick={() => setIsLogin(true)}
              className="text-blood-300 hover:underline font-semibold"
            >
              Ingresa
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthForms
