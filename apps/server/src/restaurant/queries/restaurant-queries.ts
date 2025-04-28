export const RestaurantQueries = {
  create: `
    SELECT * FROM restaurant.sp_create_restaurante(
      $1, $2, $3, $4, $5
    );
  `,
  update: `
    SELECT restaurant.sp_update_restaurante(
      $1, $2, $3, $4, $5, $6
    );
  `,
  find: `
    SELECT * FROM restaurant.sp_find_restaurante($1);
  `,
};
