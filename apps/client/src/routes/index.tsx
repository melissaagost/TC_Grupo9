import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';

//se envuelve la ruta en el layout que corresponda
//por ejemplo: home se puede envolver en landing
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth/>}/>
    </Routes>
  );
};

export default AppRoutes;
