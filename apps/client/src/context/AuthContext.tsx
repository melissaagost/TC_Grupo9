import { createContext, useState, useEffect, useContext } from 'react'

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  userType: string | null
  setUserType: (userType: string | null) => void
  idRestaurante: number | null
  setIdRestaurante: (id: number | null) => void
  idUsuario: number | null;
setIdUsuario: (id: number | null) => void;
userName?: string | null;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  userType: null,
  setUserType: () => {},
  idRestaurante: null,
  setIdRestaurante: () => {},
   idUsuario: null,
  setIdUsuario: () => {},
   userName: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [userType, setUserType] = useState<string | null>(() => localStorage.getItem('userType'))
  const [idRestaurante, setIdRestaurante] = useState<number | null>(() => {
    const storedId = localStorage.getItem('idRestaurante')
    return storedId ? parseInt(storedId) : null
  })

  const [idUsuario, setIdUsuario] = useState<number | null>(() => {
  const stored = localStorage.getItem('idUsuario');
  return stored ? parseInt(stored) : null;
});


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (userType) {
      localStorage.setItem('userType', userType)
    } else {
      localStorage.removeItem('userType')
    }
  }, [userType])

  useEffect(() => {
    if (idRestaurante !== null) {
      localStorage.setItem('idRestaurante', idRestaurante.toString())
    } else {
      localStorage.removeItem('idRestaurante')
    }
  }, [idRestaurante])

  useEffect(() => {
  if (idUsuario !== null) {
    localStorage.setItem('idUsuario', idUsuario.toString());
  } else {
    localStorage.removeItem('idUsuario');
  }
}, [idUsuario]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, userType, setUserType, idRestaurante, setIdRestaurante, idUsuario, setIdUsuario }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
