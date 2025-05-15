export const ItemQueries = {
  buscarPorId: `
      SELECT * FROM restaurant.sp_buscar_item_por_id(
        $1::INTEGER
      );
    `,

  deshabilitarItem: `
      SELECT * FROM restaurant.sp_deshabilitar_item(
        $1::INTEGER
      );
    `,

  guardarItem: `
      SELECT * FROM restaurant.sp_guardar_item(
        $1::INTEGER,
        $2::VARCHAR,
        $3::VARCHAR,
        $4::INTEGER,
        $5::NUMERIC,
        $6::INTEGER,
        $7::INTEGER,
        $8::INTEGER
      );
    `,

  listarItems: `
      SELECT * FROM restaurant.sp_listar_items(
        $1::VARCHAR,
        $2::INTEGER,
        $3::VARCHAR,
        $4::VARCHAR,
        $5::INTEGER,
        $6::INTEGER
      );
    `,
};
