export interface RespuestaGenerica {
  success: number; // 1 (ok) o 0 (error)
  message: string; // Mensaje del backend
  id: number | null; // ID del registro afectado
}
