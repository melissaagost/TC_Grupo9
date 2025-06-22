export const PedidoQueries = {
  buscarPorId: `
      SELECT * FROM restaurant.sp_buscar_pedido_por_id_completo(
        $1::INTEGER
      );
    `,

  cancelarPedido: `
      SELECT * FROM restaurant.sp_cancelar_pedido(
        $1::INTEGER
      );
    `,

  actualizarEstadoPedido: `
  SELECT * FROM restaurant.actualizar_estado_pedido(
    $1::INTEGER, -- p_id
    $2::INTEGER, -- p_nuevo_estado
  );
`,

  guardarPedidoCompleto: `
      SELECT  restaurant.sp_guardar_pedido_completo(
        $1::INTEGER,
        $2::INTEGER,
        $3::INTEGER,
        $4::JSONB
      ) AS result;
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
