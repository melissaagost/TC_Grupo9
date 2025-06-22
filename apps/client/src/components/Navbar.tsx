import { useState } from "react";
import { Calendar, BookOpen, Users, LogIn, LogOut, User, Menu, X, Utensils, UserCircle2, CookingPot, Wallet, ChevronDown  } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePermisos } from '../hooks/usePermisos'
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setToken, setUserType } = useAuth();
  const { tienePermiso } = usePermisos()
  const navigate = useNavigate();



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


            {userType !== 'administrador' && userType !== 'cocinero' && (
              <Link to="/building" className="flex items-center gap-1 hover:text-blood-100">
                <BookOpen size={16} /> Menú Invitados
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

            {/*dropdown abm's*/}
            <DropdownMenu.Root>

              <DropdownMenu.Trigger asChild>
                <button className="inline-flex align-middle gap-1">
                  Administrar <ChevronDown className="mt-1" size={16}/>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content
               align="end"
               sideOffset={8}
               className="z-50 bg-white border p-3 border-eggshell-creamy rounded-md shadow-md animate-fade-in">

                <DropdownMenu.Item>
                  {tienePermiso("ver_reservas") && (
                  <Link to="/building" className="flex items-center gap-1 pb-3 hover:text-blood-100">
                    <Calendar size={16} /> Reservas
                  </Link>
                  )}
                </DropdownMenu.Item>

                <DropdownMenu.Item>
                  {tienePermiso("ver_pedidos_pendientes") && (
                    <Link to="/orders" className="flex items-center gap-1 pb-3 hover:text-blood-100">
                      <CookingPot size={16} /> Pedidos
                    </Link>
                  )}
                </DropdownMenu.Item>

                <DropdownMenu.Item>
                  {tienePermiso("ver_pagos") && (
                    <Link to="/payments-index" className="flex items-center gap-1 pb-3 hover:text-blood-100">
                      <Wallet size={16} /> Pagos
                    </Link>
                  )}
                </DropdownMenu.Item>

                <DropdownMenu.Item>
                  {tienePermiso("ver_mesas") && (
                    <Link to="/tables" className="flex items-center gap-1 pb-3 hover:text-blood-100">
                      <Utensils size={16} /> Mesas
                    </Link>
                  )}
                </DropdownMenu.Item>

                <DropdownMenu.Item>
                  {tienePermiso("ver_menu_editable") && (
                    <Link to="/menu" className="flex items-center gap-1 pb-3 hover:text-blood-100">
                      <BookOpen size={16} /> Menú
                    </Link>
                )}
                </DropdownMenu.Item>

                <DropdownMenu.Item>
                  {tienePermiso("ver_usuarios") && (
                    <Link to="/users" className="flex items-center gap-1  hover:text-blood-100">
                      <Users size={16} /> Usuarios
                    </Link>
                  )}
                </DropdownMenu.Item>

              </DropdownMenu.Content>

            </DropdownMenu.Root>

            {/*dropdown de opciones perfil*/}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border-1 border-to-blood-300 rounded-lg  text-gray-700 hover:bg-blood-300 hover:text-white">
                    <User size={20} />
                    <span>Mi cuenta</span>
                  </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 bg-white border p-2 border-eggshell-creamy rounded-md shadow-md animate-fade-in">
                <DropdownMenu.Item>
                      <Link
                        to="/profile"
                        className="inline-flex gap-1 px-4 py-2 text-gray-700 hover:text-blood-100 ">
                        <UserCircle2/>Perfil
                      </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item>
                   <button
                        onClick={() => {
                          handleLogout();
                        }}
                        className="gap-1 px-4 py-2 inline-flex text-gray-700 hover:text-blood-100">
                        <LogOut/>
                        Cerrar Sesión
                      </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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

            {userType !== 'administrador' && userType !== 'cocinero' && (
              <Link to="/building" className="flex items-center gap-2">
                <BookOpen size={18} /> Menú Invitados
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
                {tienePermiso("ver_reservas") && (
                <Link to="/building" className="flex items-center gap-2">
                  <Calendar size={18} /> Reservas
                </Link>
                )}

                {tienePermiso("ver_pagos") && (
                  <Link to="/payments-index" className="flex items-center gap-1 hover:text-blood-100">
                    <Wallet size={16} /> Pagos
                  </Link>
                )}

                {tienePermiso("ver_pedidos_pendientes") && (
                  <Link to="/orders" className="flex items-center gap-1 hover:text-blood-100">
                    <CookingPot size={16} /> Pedidos
                  </Link>
                )}

                {tienePermiso("ver_mesas") && (
                  <Link to="/tables" className="flex items-center gap-2">
                  <Utensils size={18} /> Mesas
                </Link>
                )}


                {tienePermiso("ver_menu_editable") &&(
                <Link to="/menu" className="flex items-center gap-2">
                  <BookOpen size={18} /> Menú
                </Link>
                )}

                {tienePermiso("ver_usuarios") &&(
                <Link to="/users" className="flex items-center gap-2">
                  <Users size={18} /> Usuarios
                </Link>
                )}

                <Link to="/profile" className="flex items-center gap-2">
                  <User size={18} /> Perfil
                </Link>

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
