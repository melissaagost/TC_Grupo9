import { useState } from "react";
import { Calendar, BookOpen, Users, LogIn, LogOut, User, Menu, X, Utensils, UserCircle2  } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setToken, setUserType } = useAuth(); // 👈 usamos AuthContext
  const navigate = useNavigate(); // 👈 para redirigir

  const [dropdownOpen, setDropdownOpen] = useState(false);


  const { token, userType } = useAuth();


  const handleLogout = () => {
    setToken(null);
    setUserType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-b-eggshell-creamy bg-eggshell-whitedove/80 backdrop-blur-lg">

      <div className="container mx-auto flex items-center justify-between py-6 px-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span className="text-3xl font-playfair font-bold text-blood-100">Pora</span>
          </Link>

          {/* Navigation for desktop */}
          {/* no logueado */}
          <div className="hidden md:flex items-center font-medium gap-8 font-raleway text-base text-gray-700">


            {userType !== 'administrador' && userType !== 'usuario' && (
              <Link to="/building" className="flex items-center gap-1 hover:text-blood-100">
                <BookOpen size={16} /> Menú
              </Link>
            )}

          {!token && (
            <Link
              to="/auth"
              className="ml-4 inline-flex items-center gap-2 border border-blood-500 text-blood-500 px-4 py-1.5 rounded-md text-sm hover:bg-blood-100 hover:text-eggshell-100 transition-colors">
              <LogIn size={16} /> Ingresar
            </Link>
          )}

          {/* logueado */}
          {token && (
            <>
              {/* Cosas que ven todos los logueados */}
              <Link to="/building" className="flex items-center gap-1 hover:text-blood-100">
                <Calendar size={16} /> Reservas
              </Link>

              <Link to="/tables" className="flex items-center gap-1 hover:text-blood-100">
                <Utensils size={16} /> Mesas
              </Link>



              {/* Cosas que sólo ve el admin */}
              {(userType === 'administrador' || userType === 'usuario') && (
                <Link to="/menu" className="flex items-center gap-1 hover:text-blood-100">
                  <BookOpen size={16} /> Menú
                </Link>
              )}

              {userType === 'administrador' && (
                <Link to="/users" className="flex items-center gap-1 hover:text-blood-100">
                  <Users size={16} /> Usuarios
                </Link>
              )}


                {/* dropdown */}
                <div className="relative">

                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border-1 border-to-blood-300 rounded-lg  text-gray-700 hover:bg-blood-300 hover:text-white">
                    <User size={20} />
                    <span>Mi cuenta</span>
                  </button>

                  {/* Dropdown menú */}
                  {dropdownOpen && (
                    <div className="absolute  left mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="inline-flex gap-1 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}>
                        <UserCircle2/>Perfil
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="gap-1 px-4 py-2 inline-flex text-gray-700 hover:bg-gray-100">
                        <LogOut/>
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>


            </>
          )}
          </div>










          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu className="animate-spinOnce" size={24} />}
          </button>

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-4 font-raleway text-gray-700">

            {userType !== 'administrador' && userType !== 'usuario' && (
              <Link to="/building" className="flex items-center gap-2">
                <BookOpen size={18} /> Menú
              </Link>
            )}


              {!token && (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2  border border-blood-500 text-blood-500 px-4 py-2 rounded-md hover:bg-blood-500 hover:text-eggshell-100 transition-colors w-30 justify-left">
                <LogIn size={18} />
                Ingresar
              </Link>
              )}

              {token && (
                <>
                <Link to="/building" className="flex items-center gap-2">
                  <Calendar size={18} /> Reservas
                </Link>

                <Link to="/tables" className="flex items-center gap-2">
                  <Utensils size={18} /> Mesas
                </Link>

                <Link to="/profile" className="flex items-center gap-2">
                  <User size={18} /> Perfil
                </Link>

                {(userType === 'administrador' || userType === 'usuario') &&(
                <Link to="/menu" className="flex items-center gap-2">
                  <BookOpen size={18} /> Menú
                </Link>
                )}

                {userType === 'administrador' &&(
                <Link to="/users" className="flex items-center gap-2">
                  <Users size={18} /> Usuarios
                </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 border border-blood-500 text-blood-500 px-4 py-2 rounded-md hover:bg-blood-500 hover:text-eggshell-100 transition-colors w-40 justify-left">
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>

                </>

              )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;
