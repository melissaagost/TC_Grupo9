import axios from 'axios';

const API_URL = '/api';

const userService = {
  // GET /usuario

  getAllUsers: async (token: string) => {
    const res = await axios.get(`${API_URL}/usuario`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  // POST /usuario
  createUser: async (userData: any, token: string) => {
    const res = await axios.post(`${API_URL}/usuario`, {
      nombre: userData.nombre,
      correo: userData.correo,
      password: userData.password,

      tipoUsuarioId: userData.tipoUsuarioId,
      estado: 1,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },


  // PATCH /usuario/:id
  updateUser: async (id: number, userData: any, token: string) => {
     console.log("🔍 Datos enviados al backend:", userData);
    const res = await axios.patch(`${API_URL}/usuario/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // PATCH /usuario/:id/inactive
  setUserInactive: async (id: number, token: string) => {
    const res = await axios.patch(`${API_URL}/usuario/${id}/inactive`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // PATCH /usuario/:id/updatepass
  updatePassword: async (id: number, passwordData: any, token: string) => {
    const res = await axios.patch(`${API_URL}/usuario/${id}/updatepass`, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // GET /usuario/profile
  getProfile: async (token: string) => {
    const res = await axios.get(`${API_URL}/usuario/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

export default userService;
