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
    axiosInstance.patch<CancelarPedidoSpecificResponse>(`${API_URL}/cancelar/${id}`),

  actualizarEstado: ({ id, data }: { id: number; data: ActualizarEstadoDTO }) =>
  axiosInstance.patch<RespuestaGenericaFlat>(`${API_URL}/actualizar/${id}`, data),

  guardar: (data: PedidoCompletoGuardarDTO) =>
  axiosInstance.post<RespuestaGenericaFlat>(`${API_URL}/guardar`, data),

 listar: (params?: any) =>
  axiosInstance.get<Paginado<PedidoRowDTO>>(`${API_URL}/listar`, { params }),
};
