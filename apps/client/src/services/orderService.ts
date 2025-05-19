import axiosInstance from "./axiosInstance";
import {
  ActualizarEstadoDTO,
  ItemPedidoDTO,
  PedidoRowDTO,
  PedidoCompletoGuardarDTO,
} from "../types/orderTypes";

// Paginado genérico
interface Paginado<T> {
  data: T[];
  total: number;
}

// Respuesta genérica común
interface RespuestaGenerica {
  exito: boolean;
  mensaje: string;
  data?: any;
}

const API_URL = "pedido";

export const orderService = {
  getById: (id: number) =>
    axiosInstance.get<RespuestaGenerica>(`${API_URL}/buscar/${id}`),

  cancelar: (id: number) =>
    axiosInstance.patch<RespuestaGenerica>(`${API_URL}/cancelar/${id}`),

  actualizarEstado: (id: number, data: ActualizarEstadoDTO) =>
    axiosInstance.patch<RespuestaGenerica>(`${API_URL}/actualizar/${id}`, data),

crear: (data: PedidoCompletoGuardarDTO) =>
  axiosInstance.post<RespuestaGenerica>(`${API_URL}/guardar`, data),

 listar: (params?: any) =>
  axiosInstance.get<Paginado<PedidoRowDTO>>(`${API_URL}/listar`, { params }),
};
