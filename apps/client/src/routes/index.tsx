import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';

//se envuelve la ruta en el layout que corresponda
//por ejemplo: home se puede envolver en landing
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;
