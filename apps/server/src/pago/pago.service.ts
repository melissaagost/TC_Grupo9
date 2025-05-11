import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MetodoPagoGuardarDTO } from './dto/metodoPagoGuardarDTO';
import { RespuestaGenerica } from 'src/common/interface/respuestaGenerica';
import { PagoQueries } from './queries/pago-queries';
import {
  MetodoPagoBuscarTodos,
  Paginado,
} from './interfaces/metodoPagoFind.interface';
import { MetodoPagoRowDTO } from './dto/metodoPagoRowDTO';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}

  guardarMetodoPagoAsync = async (
    data: MetodoPagoGuardarDTO,
  ): Promise<RespuestaGenerica> => {
    const { id_metodo, nombre, estado = 1 } = data;

    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      PagoQueries.guardarMetodoPago,
      id_metodo ?? null,
      nombre,
      estado,
    );

    return result[0];
  };

  deshabilitarMetodoPagoAsync = async (
    id: number,
  ): Promise<RespuestaGenerica> => {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      PagoQueries.deshabilitarMetodoPago,
      id,
    );

    return result[0];
  };

  buscarTodosMetosPagoAsync = async (
    params: MetodoPagoBuscarTodos,
  ): Promise<Paginado<MetodoPagoRowDTO>> => {
    const {
      busqueda = null,
      estado = null,
      ordenCol = 'nombre',
      ordenDir = 'ASC',
      pageIndex = 1,
      pageSize = 10,
    } = params;

    // Forzado seguro a number si vienen como string
    const parsedEstado =
      estado !== undefined ? parseInt(String(estado), 10) : null;
    const parsedPageIndex = parseInt(String(pageIndex), 10);
    const parsedPageSize = parseInt(String(pageSize), 10);

    const result = await this.prisma.$queryRawUnsafe<MetodoPagoRowDTO[]>(
      PagoQueries.buscarTodosMetodosPago,
      busqueda,
      parsedEstado,
      ordenCol,
      ordenDir,
      parsedPageIndex,
      parsedPageSize,
    );

    const data = result.map((row) => {
      const { id_metodo, nombre, estado, total_rows } = row;
      return {
        id_metodo,
        nombre,
        estado,
        total_rows: Number(total_rows),
      };
    });

    const total = data.length > 0 ? data[0].total_rows : 0;

    return {
      data,
      total,
      pageIndex: parsedPageIndex,
      pageSize: parsedPageSize,
    };
  };
}
