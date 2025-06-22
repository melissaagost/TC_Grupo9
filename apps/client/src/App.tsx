import AppRoutes from './routes';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      <main className="flex-grow">
        <AppRoutes />
        <ToastContainer position="top-center" autoClose={3000} />
      </main>

      <Footer />

    </div>
  );
};

export default App;




