import { FiltroBase } from 'src/common/interface/filtroBase';

export interface MetodoPagoBuscarTodos extends FiltroBase {
  busqueda?: string;
}

export interface Paginado<T> {
  data: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}
