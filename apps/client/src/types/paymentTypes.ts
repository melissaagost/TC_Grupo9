export interface MetodoPagoGuardarDTO{
  id_metodo?: number;
  nombre: string;
  // Opcional, 0 o 1
  estado?: number;
}
export interface MetodoPagoRow{
  id_metodo: number;
  nombre: string;
  estado: number;
  total_rows: number;
}

export interface PagoGuardarDTO{
  id_pago?: number;
  id_pedido: number;
  id_metodo: number;
  estado: number;
}

export interface PagoRowDTO{
  id_pago: number;
  id_pedido: number;
  fecha: Date;
  monto: number;
  nombre_metodo: string;
  metodo_estado: number;
  pedido_cantidad: number;
  pedido_precio: number;
  id_metodo: number;
  estado: number;
  total_rows: number;
}

export class FiltroBase {
    estado?: number | null;
    busqueda?: string;
    ordenCol?: string;
    ordenDir?: 'ASC' | 'DESC';
      pageIndex: number = 0;
  pageSize: number = 10;
}