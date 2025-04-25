export const UsuarioQueries = {
  create: `
    SELECT * FROM auth.sp_create_usuario(
      $1::text,
      $2::text,
      $3::text,
      $4::int
    );
  `,
  update: `
    SELECT auth.sp_update_usuario($1::int, $2::text, $3::text, $4::int, $5::int);
  `,
  setInactive: `
    SELECT auth.sp_set_inactivo_usuario($1::int);
  `,
  updatePassword: `
    SELECT auth.sp_update_password($1::int, $2::text);
  `,
  getAll: `
    SELECT * FROM auth.sp_obtener_todos_usuarios();
  `,
  findProfile: `
    SELECT * FROM auth.sp_obtener_perfil_usuario($1::int);
  `,
};
