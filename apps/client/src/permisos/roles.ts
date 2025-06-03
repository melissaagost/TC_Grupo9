//maneja que permisos va a tener cada user
export const permisosPorRol: Record<string, string[]> = {
  cocinero: [ //usuario = cocinero
    "ver_menu",
    "setear_estado",
    "marcar_en_preparacion"
  ],
  mozo: [
    "ver_menu",
    "crear_pedido",
    "eliminar_pedido_historial",
    "filtrar_pedidos"
  ],
  admin: [
    // todos los permisos por defecto, se pueden definir algunos explícitos
    "ver_menu",
    "editar_menu",
    "crear_menu",
    "administrar_categorias",
    "añadir_producto",
    //"editar_producto",
    "setear_estado",
    "ver_pagos",
    "crear_usuario",
    "ver_reportes",
  ],
};
