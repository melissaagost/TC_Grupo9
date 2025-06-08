//extrae automaticamente el contenido de la rsta anidad del sp
//normaliza su estructura
//sirve para todos los sp

import { RespuestaGenerica } from "../types/respuestaGenerica";

export interface StoredProcedureResponse<T = any> {
  success: boolean;
  message: string;
  payload?: T;
}

export function parseStoredProcedureResponse<T extends RespuestaGenerica = RespuestaGenerica>(
  response: any
): StoredProcedureResponse<T> {
  if (!response || typeof response !== "object") {
    return {
      success: false,
      message: "Respuesta inválida del servidor",
    };
  }

  const inner = Object.values(response)[0] as T;

  return {
    success: inner.success === 1,
    message: inner.message || "Respuesta sin mensaje",
    payload: inner,
  };
}

// Extrae listas paginadas de respuestas tipo: { sp_listar_pagos: { data: [...], total: N } }
export function parseStoredProcedureListResponse<T>(response: Record<string, any>): {
  data: T[];
  total: number;
} {
  const inner = Object.values(response)[0];
  return {
    data: inner?.data ?? [],
    total: inner?.total ?? 0,
  };
}

