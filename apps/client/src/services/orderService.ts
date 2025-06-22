import axiosInstance from "./axiosInstance";
import {
  ActualizarEstadoDTO,
  ItemPedidoDTO,
  PedidoRowDTO,
  PedidoCompletoGuardarDTO,
} from "../types/orderTypes";
import { RespuestaGenerica as BackendRespuestaGenerica } from "../types/respuestaGenerica";

// Paginado genérico
interface Paginado<T> {
  data: T[];
  total: number;
}

// Respuesta genérica común (used by guardar, actualizarEstado - may need per-endpoint adjustment if they also become nested)
interface RespuestaGenericaFlat {
  success: boolean;
  message: string;
  id: number | null;
  data?: any;
}

// Specific response type for cancelar pedido if it's nested
interface CancelarPedidoSpecificResponse {
  sp_cancelar_pedido: BackendRespuestaGenerica;
}

// Specific response type for actualizar estado (assuming similar nesting, adjust if not)
// If actualizarEstado returns a flat response, this isn't needed for it.
interface ActualizarEstadoSpecificResponse {
  sp_actualizar_estado_pedido: BackendRespuestaGenerica;
}

const API_URL = "pedido";

export const orderService = {

  getById: async (id_pedido: number): Promise<PedidoCompletoGuardarDTO> => {
    const response = await axiosInstance.get(`pedido/buscar/${id_pedido}`);
    const data = response.data;

    if (data.length === 0) {
      throw new Error(`Pedido con id ${id_pedido} no encontrado`);
    }

    // Adaptá el mapeo a lo que esperás construir como PedidoCompletoGuardarDTO
    return {
      id_pedido: data[0].id_pedido,
      id_mesa: data[0].id_mesa,
      id_usuario: data[0].id_usuario,
      items: data.map((pedido: PedidoRowDTO) => {return {
          id_item: pedido.id_item,
          nombre: pedido.nombre_item,
          descripcion: pedido.descripcion_item,
          subtotal: pedido.subtotal_item,
          cantidad: pedido.cantidad_item,
        }})
    }
  },

  cancelar: (id: number) =>
    axiosInstance.patch<CancelarPedidoSpecificResponse>(`${API_URL}/cancelar/${id}`),

  actualizarEstado: ({ id, data }: { id: number; data: ActualizarEstadoDTO }) =>
  axiosInstance.patch<RespuestaGenericaFlat>(`${API_URL}/actualizar/${id}`, data),

  guardar: (data: PedidoCompletoGuardarDTO) =>
  axiosInstance.post<RespuestaGenericaFlat>(`${API_URL}/guardar`, data),

 listar: (params?: any) =>
  axiosInstance.get<Paginado<PedidoRowDTO>>(`${API_URL}/listar`, { params }),
};
