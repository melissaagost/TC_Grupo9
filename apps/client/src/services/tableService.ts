import axios from "axios";

const API_URL = 'http://localhost:3000/api/mesa';

export const getAllMesas = async () => {
  const response = await axios.get(API_URL);
  return response.data.data; // porque tu backend devuelve { data: mesas }
};

export const getMesaById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getMesasConPedido = async () => {
  const response = await axios.get(`${API_URL}/con-pedido`);
  return response.data; // o response.data.data si tu controller usa `{ data: mesas }`
};

export const createMesa = async (mesa: {
  numero: number;
  capacidad: number;
  descripcion: string;
  id_restaurante: number;
}) => {
  const response = await axios.post(API_URL, mesa);
  return response.data;
};

export const updateMesa = async (id: number, mesa: {
  numero?: number;
  capacidad?: number;
  descripcion?: string;
  id_restaurante?: number;
}) => {
  return axios.patch(`${API_URL}/${id}`, mesa);
};


export const setMesaLibre = async (id: number) => {
  const response = await axios.patch(`${API_URL}/${id}/libre`);
  return response.data;
};

export const setMesaOcupado = async (id: number) => {
  const response = await axios.patch(`${API_URL}/${id}/ocupado`);
  return response.data;
};

export const setMesaReservado = async (id: number) => {
  const response = await axios.patch(`${API_URL}/${id}/reservado`);
  return response.data;
};
