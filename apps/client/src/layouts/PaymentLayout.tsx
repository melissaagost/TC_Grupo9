import Sidebar from '../components/Payment/Sidebar';
import { Outlet } from 'react-router-dom';
import Title from '../components/Payment/Title';

const MainLayout = () => {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 pt-4 overflow-x-auto bg-white min-h-screen">
        <Title/>
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
