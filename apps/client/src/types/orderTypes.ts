export interface ActualizarEstadoDTO{
    nuevo_estado: number
}

export interface ItemPedidoDTO {
  id_item: number;
  cantidad: number;
}

export interface PedidoCompletoGuardarDTO {
  id_pedido?: number;
  id_usuario: number;
  id_mesa: number;
  items: ItemPedidoDTO[];
}


export interface PedidoRowDTO {
  id_pedido: number;
  cantidad_total: number;
  precio_total: number;
  estado_pedido: number;
  estado_descripcion: string;
  fecha: Date;
  id_mesa: number;
  numero_mesa: string;
  descripcion_mesa: string;
  id_usuario: number;
  usuario_nombre: string;
  tipo_usuario: string;
  id_item: number;
  nombre_item: string;
  descripcion_item: string;
  cantidad_item: number;
  subtotal_item: number;
  total_rows: number;
}
