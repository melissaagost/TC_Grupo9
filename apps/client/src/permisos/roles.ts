//maneja que permisos va a tener cada user
export const permisosPorRol: Record<string, string[]> = {
  cocinero: [
    "ver_menu_editable",
    "ver_pedidos_pendientes",
    "setear_estado",
    "marcar_en_preparacion"
  ],
  mozo: [
    "ver_pagos_pedidos",
    "ver_pagos",
    "ver_pedidos_pendientes",
    "ver_mesas",
    "ver_reservas",
    "crear_pedido",
    "eliminar_pedido_historial",
    "filtrar_pedidos"
  ],
  admin: [
    // todos los permisos por defecto, se pueden definir algunos explícitos
    // "ver_menu_editable",
    // "ver_usuarios",
    // "ver_reservas",
    // "ver_pagos_pedidos",
    // "editar_menu",
    // "crear_menu",
    // "administrar_categorias",
    // "añadir_producto",
    // "setear_estado",
    // "ver_pagos",
    // "crear_usuario",
    // "ver_reportes",
    // "ver_mesas",
  ],
};
