import { createContext, useState, useEffect, useContext } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  userType: number | null;
  setUserType: (userType: number | null) => void;
}


const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  userType: null,
  setUserType: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [userType, setUserType] = useState<number | null>(() => {
    const storedUserType = localStorage.getItem('userType');
    return storedUserType ? parseInt(storedUserType) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);



  return (
    <AuthContext.Provider value={{ token, setToken, userType, setUserType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
