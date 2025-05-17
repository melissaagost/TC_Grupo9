export interface ItemRowDTO {
  id_item: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  estado: number;
  id_categoria: number;
  nombre_categoria: string;
  id_menu: number;
  total_rows: number;
}

export interface ItemGuardarDTO {
  id_item?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: number;
  id_categoria: number;
  id_menu: number;
}


export interface Paginado<T> {
  data: T[];
  total: number;
}

