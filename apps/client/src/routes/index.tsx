import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Tables from '../pages/Tables';
import Building  from '../pages/Building';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';


//se envuelve la ruta en el layout que corresponda

//usuarios tipo 2 (mozos) pueden acceder a: mesas, menu, reservas
//usuarios tipo 1 (dueño): abm usuarios del sistema
//auth = vista login
//public route para redirigir al usuario logueado

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/auth" element={<PublicRoute><Auth/></PublicRoute>}/>

      <Route path="/profile" element={<Profile/>}/>

      <Route path="/profile/edit" element={<EditProfile/>}/>

      <Route path="/tables" element={<Tables/>}/>

      {/*esta seria abm usuarios pero esta en construccion */}
      <Route path="/building" element={<Building/>}/>

    </Routes>
  );
};

export default AppRoutes;
