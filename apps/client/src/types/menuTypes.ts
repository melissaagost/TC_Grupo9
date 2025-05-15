export interface Menu {
  id_menu: number;
  nombre: string;
  descripcion: string;
  estado: number;
  creadoEn: string;
  actualizadoEn: string;
}

// Equivale a CreateMenu y UpdateMenu del backend
export interface MenuDTO {
  nombre: string;
  descripcion: string;
  estado: number;
}
