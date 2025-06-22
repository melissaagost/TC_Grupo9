export interface CategoriaDTO {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface CategoriaCrearDTO {

  nombre: string;
  descripcion: string;
}

export interface CategoriaActualizarDTO extends CategoriaCrearDTO {}
