export const MetodoPagoQueries = {
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

export const PagoQueries = {
  guardarPago: `
    SELECT * FROM sp_guardar_pago(
      $1::INTEGER,
      $2::INTEGER,
      $3::INTEGER,
      $4::INTEGER
  );`,
  listarPagos: `
    SELECT * FROM sp_listar_pagos(
      $1::VARCHAR,
      $2::INTEGER,
      $3::VARCHAR,
      $4::VARCHAR,
      $5::INTEGER,
      $6::INTEGER
    );
  `,
  cancelarPago: `
  SELECT * FROM sp_cancelar_pago(
    $1::INTEGER
  );
`,
};
