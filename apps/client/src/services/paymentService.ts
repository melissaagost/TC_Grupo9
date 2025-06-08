//para post y patch axiosInstance.post<Record<string, RespuestaGenerica>>(...)
//para get axiosInstance.get<Record<string, any>>(...)
//seimpre se pasa la rta a traves del helper
//devuelve una consulta paginada de los pagos y demas

import axiosInstance from "./axiosInstance";
import {
  RespuestaGenerica as BackendRespuestaGenerica,
} from "../types/respuestaGenerica";

import {
  MetodoPagoGuardarDTO,
  MetodoPagoRow,
  PagoGuardarDTO,
  PagoRowDTO,
  FiltroBase,
} from "../types/paymentTypes";


// Paginado genérico para SPs que devuelven listas
interface Paginado<T> {
  data: T[];
  total: number;
}

const API_URL = "pago";

export const PaymentService = {

  // Métodos de pago

  buscarMetodosPago: (query: FiltroBase) =>
    axiosInstance.get<Record<string, Paginado<MetodoPagoRow>>>(
      `${API_URL}/buscar_metodo_pago`,
      { params: query }
    ),

  guardarMetodoPago: (data: MetodoPagoGuardarDTO) =>
    axiosInstance.post<Record<string, BackendRespuestaGenerica>>(
      `${API_URL}/guardar_metodo_pago`,
      data
    ),

  deshabilitarMetodoPago: (id: number) =>
    axiosInstance.patch<Record<string, BackendRespuestaGenerica>>(
      `${API_URL}/deshabilitar_metodo_pago/${id}`
    ),

    habilitarMetodoPago: (id: number) =>
    axiosInstance.patch<Record<string, BackendRespuestaGenerica>>(
      `${API_URL}/habilitar_metodo_pago/${id}`
    ),

  // Pagos

  listarPagos: (query: FiltroBase) =>
    axiosInstance.get<Record<string, Paginado<PagoRowDTO>>>(
      `${API_URL}/listar`,
      { params: query }
    ),

  guardarPago: (data: PagoGuardarDTO) =>
    axiosInstance.post<Record<string, BackendRespuestaGenerica>>(
      `${API_URL}/guardar`,
      data
    ),

  cancelarPago: (id: number) =>
    axiosInstance.patch<Record<string, BackendRespuestaGenerica>>(
      `${API_URL}/cancelar/${id}`
    ),
};