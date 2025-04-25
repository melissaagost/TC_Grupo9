import AppRoutes from './routes';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      <main className="flex-grow">
        <AppRoutes />
      </main>

      <Footer />

    </div>
  );
};

export default App;




