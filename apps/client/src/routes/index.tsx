import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Auth from '../pages/Auth'
import Profile from '../pages/Profile'
import EditProfile from '../pages/EditProfile'
import Tables from '../pages/Tables'
import Users from '../pages/Users'
import Menu from '../pages/Menu'
import Categories from '../pages/Categories'
import Orders from '../pages/Orders'

import Building from '../pages/Building'
import PrivateRoute from '../components/PrivateRoute'
import PublicRoute from '../components/PublicRoute'

//se envuelve la ruta en el layout que corresponda
//tipo 1 (admin)
//tipo 2 (cocinero)
//tipo 3 (mozo)


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute allowedUserTypes={['cocinero', 'administrador', 'mozo']}>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <PrivateRoute allowedUserTypes={['cocinero', 'administrador', 'mozo']}>
            <EditProfile />
          </PrivateRoute>
        }
      />

      <Route
        path="/tables"
        element={
          <PrivateRoute allowedUserTypes={['mozo', 'administrador']}>
            <Tables />
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute allowedUserTypes={['administrador']}>
            <Users/>
          </PrivateRoute>
        }
      />

      <Route
        path="/menu"
        element={
          <PrivateRoute allowedUserTypes={['administrador', 'cocinero']}>
            <Menu/>
          </PrivateRoute>
        }
      />


      <Route
        path="/categories"
        element={
          <PrivateRoute allowedUserTypes={['administrador']}>
            <Categories/>
          </PrivateRoute>
        }
      />

        <Route
        path="/orders"
        element={
          <PrivateRoute allowedUserTypes={['administrador', 'mozo', 'cocinero']}>
            <Orders/>
          </PrivateRoute>
        }
      />

      {/*esta seria abm usuarios pero esta en construccion */}
      <Route path="/building" element={<Building />} />
    </Routes>
  )
}

export default AppRoutes
