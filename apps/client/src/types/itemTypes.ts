export interface Item {
  id_item: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: number; // 1 o 0
  id_menu: number;
  id_categoria: number;
  categoria: {
    id: number;
    nombre: string;
  };
}

export interface ItemDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: number; // 0 o 1
  id_menu: number;
  id_categoria: number;
}
