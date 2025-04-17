import AppRoutes from './routes';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer'

const App = () => {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
};

export default App;
