import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Titulo</h2>
      <nav className="flex flex-col gap-4">
        <NavLink to="/payments-index" className={({ isActive }) => isActive ? 'text-blue-400' : ''}>Inicio</NavLink>
        <NavLink to="/payments-index/payments" className={({ isActive }) => isActive ? 'text-blue-400' : ''}>Pagos</NavLink>
        <NavLink to="/payments-index/payment-methods" className={({ isActive }) => isActive ? 'text-blue-400' : ''}>Métodos de Pago</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
