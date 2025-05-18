export const PedidoQueries = {
  buscarPorId: `
      SELECT * FROM restaurant.sp_buscar_pedido_por_id(
        $1::INTEGER
      );
    `,

  cancelarPedido: `
      SELECT * FROM restaurant.sp_cancelar_pedido(
        $1::INTEGER
      );
    `,

  guardarPedidoCompleto: `
      SELECT * FROM restaurant.sp_guardar_pedido_completo(
        $1::INTEGER,
        $2::INTEGER,
        $3::INTEGER,
        $4::JSONB
      );
    `,

  listarPedidoCompleto: `
      SELECT * FROM restaurant.sp_listar_pedido_completo(
        $1::VARCHAR,
        $2::INTEGER,
        $3::VARCHAR,
        $4::VARCHAR,
        $5::INTEGER,
        $6::INTEGER
      );
    `,
};
