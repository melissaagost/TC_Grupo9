import axios from "axios";
import { Menu, MenuDTO } from "../types/menuTypes";

const BASE_URL = "/api/menu";

// Obtener todos los menús (requiere token)
const getAllMenus = async (token: string): Promise<Menu[]> => {
  const res = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Obtener un menú por ID (requiere token)
const getMenuById = async (id: number, token: string): Promise<Menu> => {
  const res = await axios.get(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Crear un nuevo menú (requiere token)
const createMenu = async (data: MenuDTO, token: string): Promise<Menu> => {
  const res = await axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Actualizar un menú por ID (requiere token)
const updateMenu = async (
  id: number,
  data: MenuDTO,
  token: string
): Promise<{ message: string }> => {
  const res = await axios.patch(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Deshabilitar un menú por ID (requiere token)
const disableMenu = async (
  id: number,
  token: string
): Promise<{ message: string }> => {
  const res = await axios.patch(`${BASE_URL}/${id}/disable`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const menuService = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  disableMenu,
};
