export const MesaQueries = {
  create: `SELECT * FROM restaurant.sp_create_mesa($1, $2, $3, $4);`,
  update: `SELECT * FROM restaurant.sp_update_mesa($1, $2, $3, $4);`,
  findAll: `SELECT * FROM restaurant.sp_find_all_mesas();`,
  findById: `SELECT * FROM restaurant.sp_find_mesa_by_id($1);`,
  setEstadoOcupado: `SELECT restaurant.sp_set_estado_ocupado_mesa($1);`,
  setEstadoLibre: `SELECT restaurant.sp_set_estado_libre_mesa($1);`,
};
