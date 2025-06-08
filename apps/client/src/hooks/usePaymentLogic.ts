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
      const data = (res.data.data as unknown as MetodoPagoRow[]) || [];
      setMetodosPago(data);

    } catch (err) {
      console.error("Error al traer datos:", err);
      setError("Error al buscar métodos de pago");
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  // When there's no search term, metodosFiltrados should be the same as metodosPago
  if (!busqueda) {
    setMetodosFiltrados(metodosPago);
  } else {
    // Logic to filter metodosPago based on busqueda and update metodosFiltrados
    const filtered = metodosPago.filter(metodo =>
      metodo.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setMetodosFiltrados(filtered);
  }
}, [metodosPago, busqueda]); // This effect should run whenever the full list or the search term changes.


  const guardarMetodoPago = async (dto: MetodoPagoGuardarDTO) => {
    setLoading(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await PaymentService.guardarMetodoPago(dto);
      const { success, message } = parseStoredProcedureResponse<RespuestaGenerica>(res.data.sp_guardar_metodo_pago);

       if (success) {
        setMensaje(message); // ← o simplemente retornarlo
        return { success: true, message };
      } else {
        setError(message);
        return { success: false, message };
      }
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

      if (success) {
        setMensaje(message); // ← o simplemente retornarlo
        return { success: true, message };
      } else {
        setError(message);
        return { success: false, message };
      }
    } catch (err) {
      setError("Error al deshabilitar el método de pago");
      return { success: false, message: "Error inesperado" };
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

        if (success) {
          setMensaje(message); // ← o simplemente retornarlo
          return { success: true, message };
        } else {
          setError(message);
          return { success: false, message };
        }
      } catch (err) {
        setError("Error al habilitar el método de pago");
        return { success: false, message: "Error inesperado" };
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
      const { data, total } = parseStoredProcedureListResponse<PagoRowDTO>(res.data); //o bien, const {data, total} = res.data.data
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
    setMetodosPago,
    metodosFiltrados,      // lista filtrada automáticamente
    setMetodosFiltrados,
    busqueda,
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
