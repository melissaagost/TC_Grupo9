import Sidebar from '../components/Payment/Sidebar';
import { Outlet } from 'react-router-dom';
import Title from '../components/Payment/Title';

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Title/>
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
