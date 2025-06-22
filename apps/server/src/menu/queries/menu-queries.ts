export const MenuQueries = {
  create: `
    SELECT * FROM restaurant.sp_create_menu(
      $1, -- nombre
      $2  -- descripcion
    );
  `,

  update: `
    SELECT * FROM restaurant.sp_update_menu(
      CAST($1 AS INT), -- id_menu
      $2, -- nombre
      $3  -- descripcion
    );
  `,

  findOne: `
    SELECT * FROM restaurant.sp_find_menu(
      $1 -- id_menu
    );
  `,

  disable: `
    SELECT restaurant.sp_disable_menu(
      $1 -- id_menu
    );
  `,

  enable: `
    SELECT restaurant.sp_enable_menu(
      $1 -- id_menu
    );
  `,
};
