import { useState, useEffect } from "react";
import { PaymentService } from "../services/paymentService";
import {
  MetodoPagoGuardarDTO,
  MetodoPagoRow,
  PagoGuardarDTO,
  PagoRowDTO,
  FiltroBase,
} from "../types/paymentTypes";
import { RespuestaGenerica } from "../types/respuestaGenerica";
import {
  parseStoredProcedureResponse,
  parseStoredProcedureListResponse,
} from "../utils/spResponse";

export function usePaymentLogic() {
  // Estados
  const [metodosPago, setMetodosPago] = useState<MetodoPagoRow[]>([]);
  const [pagos, setPagos] = useState<PagoRowDTO[]>([]);
  const [totalPagos, setTotalPagos] = useState<number>(0);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  //busqueda / filtro:
  //metodos de pago
  const [metodosFiltrados, setMetodosFiltrados] = useState<MetodoPagoRow[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");

  //pagos

  // Métodos de pago
  const buscarMetodosPago = async (query: FiltroBase) => {
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await PaymentService.buscarMetodosPago(query);
      const { data } = parseStoredProcedureListResponse<MetodoPagoRow>(res.data);
      setMetodosPago(data);
    } catch (err) {
      setError("Error al buscar métodos de pago");
    } finally {
      setLoading(false);
    }
  };

    // Filtrar en base al término de búsqueda
  useEffect(() => {
    const term = busqueda.toLowerCase();
    const filtrados = metodosPago.filter((m) =>
      m.nombre.toLowerCase().includes(term)
    );
    setMetodosFiltrados(filtrados);
  }, [busqueda, metodosPago]);

  const guardarMetodoPago = async (dto: MetodoPagoGuardarDTO) => {
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await PaymentService.guardarMetodoPago(dto);
      const { success, message } = parseStoredProcedureResponse<RespuestaGenerica>(res.data);
      success ? setMensaje(message) : setError(message);
    } catch {
      setError("Error al guardar el método de pago");
    } finally {
      setLoading(false);
    }
  };

  const deshabilitarMetodoPago = async (id: number) => {
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await PaymentService.deshabilitarMetodoPago(id);
      const { success, message } = parseStoredProcedureResponse<RespuestaGenerica>(res.data);
      success ? setMensaje(message) : setError(message);
    } catch {
      setError("Error al deshabilitar el método de pago");
    } finally {
      setLoading(false);
    }
  };

    const habilitarMetodoPago = async (id: number) => {
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await PaymentService.habilitarMetodoPago(id);
      const { success, message } = parseStoredProcedureResponse<RespuestaGenerica>(res.data);
      success ? setMensaje(message) : setError(message);
    } catch {
      setError("Error al habilitar el método de pago");
    } finally {
      setLoading(false);
    }
  };



  // Pagos
  const listarPagos = async (query: FiltroBase) => {
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await PaymentService.listarPagos(query);
      const { data, total } = parseStoredProcedureListResponse<PagoRowDTO>(res.data);
      setPagos(data);
      setTotalPagos(total);
    } catch {
      setError("Error al listar pagos");
    } finally {
      setLoading(false);
    }
  };

  const guardarPago = async (dto: PagoGuardarDTO) => {
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await PaymentService.guardarPago(dto);
      const { success, message } = parseStoredProcedureResponse<RespuestaGenerica>(res.data);
      success ? setMensaje(message) : setError(message);
    } catch {
      setError("Error al guardar el pago");
    } finally {
      setLoading(false);
    }
  };

  const cancelarPago = async (id: number) => {
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await PaymentService.cancelarPago(id);
      const { success, message } = parseStoredProcedureResponse<RespuestaGenerica>(res.data);
      success ? setMensaje(message) : setError(message);
    } catch {
      setError("Error al cancelar el pago");
    } finally {
      setLoading(false);
    }
  };

  return {
    metodosPago,
    metodosFiltrados,      // lista filtrada automáticamente
    setBusqueda,           // para vincular con el input
    pagos,
    totalPagos,
    mensaje,
    error,
    loading,

    // Métodos disponibles
    buscarMetodosPago,
    guardarMetodoPago,
    deshabilitarMetodoPago,
    habilitarMetodoPago,
    listarPagos,
    guardarPago,
    cancelarPago,
  };
}
