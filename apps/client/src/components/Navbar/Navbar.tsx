import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">MyLanding</div>
      <ul className="nav-links">
        <li><NavLink to="/" end>Inicio</NavLink></li>
        <li><NavLink to="/about">Sobre</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
