import { useState } from "react";
import { Calendar, BookOpen, Users, LogIn, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (

    <nav className="sticky top-0 z-50 border-b border-b-eggshell-creamy bg-eggshell-whitedove/80 backdrop-blur-lg">

      <div className="container mx-auto flex items-center justify-between py-6 px-6">

        {/* Logo */}
        <div className="flex items-center gap-1">
          <span className="text-2xl font-playfair font-bold text-blood-100">FoodTable</span>
          <span className="text-lg font-playfair text-gold-golden">Pro</span>
        </div>

        {/* Navigation for desktop */}
        <div className="hidden md:flex items-center font-medium gap-8 font-raleway text-base text-gray-700">

          <Link to="/reservations" className="flex items-center gap-1 hover:text-blood-100">
            <Calendar size={16} /> Reservas
          </Link>

          <Link to="/menu" className="flex items-center gap-1 hover:text-blood-100">
            <BookOpen size={16} /> Menú
          </Link>

          <Link to="/users" className="flex items-center gap-1 hover:text-blood-100">
            <Users size={16} /> Usuarios
          </Link>

          <Link
            to="/auth"
            className="ml-4 inline-flex items-center gap-2 border border-blood-500 text-blood-500 px-4 py-1.5 rounded-md text-sm hover:bg-blood-100 hover:text-eggshell-100 transition-colors">
            <User size={16} /> Ingresar
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 "
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} >

          {isMobileMenuOpen ? <X size={24} /> : <Menu className="animate-spinOnce" size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (

        <div className="md:hidden px-6 pb-4 space-y-4 font-raleway text-gray-700 ">

          <Link to="/reservations" className="flex items-center gap-2">
            <Calendar size={18} /> Reservas
          </Link>

          <Link to="/menu" className="flex items-center gap-2">
            <BookOpen size={18} /> Menú
          </Link>

          <Link to="/users" className="flex items-center gap-2">
            <Users size={18} /> Usuarios
          </Link>

          <Link
            to="/auth"
            className="inline-flex items-center gap-2  border border-blood-500 text-blood-500 px-4 py-2 rounded-md hover:bg-blood-500 hover:text-eggshell-100 transition-colors w-30 justify-left">
            <LogIn size={18} />
            Ingresar
          </Link>

        </div>

      )}
    </nav>

  );
};

export default Navbar;
