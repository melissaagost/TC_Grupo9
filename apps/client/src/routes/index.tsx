import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Tables from '../pages/Tables';
import Building  from '../pages/Building';


//se envuelve la ruta en el layout que corresponda
//por ejemplo: home se puede envolver en landing
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/profile/edit" element={<EditProfile/>}/>
      <Route path="/tables" element={<Tables/>}/>

      <Route path="/building" element={<Building/>}/>


    </Routes>
  );
};

export default AppRoutes;
