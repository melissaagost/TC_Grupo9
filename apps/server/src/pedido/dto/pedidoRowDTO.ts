export class PedidoRowDTO {
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
