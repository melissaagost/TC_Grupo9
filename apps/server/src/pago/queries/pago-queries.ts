export const PagoQueries = {
  guardarMetodoPago: `SELECT * FROM sp_guardar_metodo_pago(
        $1::INTEGER, $2::VARCHAR, $3::INTEGER
    );`,
  deshabilitarMetodoPago: `
    SELECT deshabilitar_metodo_pago(
      $1::INTEGER
    );
  `,
  buscarTodosMetodosPago: `
    SELECT * FROM sp_listar_metodos_pago(
    $1::VARCHAR,
    $2::INTEGER,
    $3::VARCHAR,
    $4::VARCHAR,
    $5::INTEGER,
    $6::INTEGER
    );
  `,
};
