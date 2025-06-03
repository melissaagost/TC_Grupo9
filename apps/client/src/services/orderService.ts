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
  success: boolean;
  message: string;
  id: number | null;
  data?: any;
}

const API_URL = "pedido";

export const orderService = {
    getById: async (id_pedido: number): Promise<PedidoCompletoGuardarDTO> => {
    const response = await axiosInstance.get(`/api/pedidos/${id_pedido}`);
    const rows: PedidoRowDTO[] = response.data;

    const { id_mesa, id_usuario, id_pedido: pedidoId } = rows[0];

    const items = rows.map((row) => ({
      id_item: row.id_item,
      cantidad: row.cantidad_item,
    }));

    return {
      id_pedido: pedidoId,
      id_mesa,
      id_usuario,
      items,
    };
  },

  cancelar: (id: number) =>
    axiosInstance.patch<RespuestaGenerica>(`${API_URL}/cancelar/${id}`),

  actualizarEstado: ({ id, data }: { id: number; data: ActualizarEstadoDTO }) =>
  axiosInstance.patch<RespuestaGenerica>(`${API_URL}/actualizar/${id}`, data),

  guardar: (data: PedidoCompletoGuardarDTO) =>
  axiosInstance.post<RespuestaGenerica>(`${API_URL}/guardar`, data),

 listar: (params?: any) =>
  axiosInstance.get<Paginado<PedidoRowDTO>>(`${API_URL}/listar`, { params }),
};
