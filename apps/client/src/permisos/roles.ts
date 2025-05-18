//maneja que permisos va a tener cada user
export const permisosPorRol: Record<string, string[]> = {
  cocinero: [
    "ver_menu",
    "setear_estado",
  ],
  mozo: [
    "ver_menu",
    "crear_pedido",
  ],
  admin: [
    // todos los permisos por defecto, se pueden definir algunos explícitos
    "ver_menu",
    "editar_menu",
    "setear_estado",
    "ver_pagos",
    "crear_usuario",
    "ver_reportes",
  ],
};
