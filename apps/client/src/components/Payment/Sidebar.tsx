import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="font-raleway w-64 h-screen bg-white text-white border-1 border-gray-100 flex flex-col ">

      <h2 className="text-2xl font-playfair  text-blood-100 font-bold mb-6 border-b-2 p-4 border-gray-100">Gestión de Pagos</h2>

      <nav className="flex flex-col  text-gray-charcoal gap-4">
        <NavLink
          to="/payments-index"
          end
          className={({ isActive }) =>
            `block w-full rounded-md transition-colors duration-150 ${
              isActive
                ?'bg-blood-100/15 text-blood-100 border-r-4 border-blood-100 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <span className="block px-4 py-2">Inicio</span>
        </NavLink>

        <NavLink
          to="/payments-index/payments"
          end
          className={({ isActive }) =>
            `block w-full rounded-md transition-colors duration-150 ${
              isActive
                ? 'bg-blood-100/15 text-blood-100 border-r-4 border-blood-100 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <span className="block px-4 py-2">Pagos</span>
        </NavLink>

        <NavLink
          to="/payments-index/payment-methods"
          end
          className={({ isActive }) =>
            `block w-full rounded-md transition-colors duration-150 ${
              isActive
                ? 'bg-blood-100/15 text-blood-100 border-r-4 border-blood-100 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <span className="block px-4 py-2">Métodos de Pago</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
