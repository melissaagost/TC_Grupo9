import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MetodoPagoGuardarDTO } from './dto/metodoPagoGuardarDTO';
import { RespuestaGenerica } from 'src/common/interface/respuestaGenerica';
import { PagoQueries, MetodoPagoQueries } from './queries/pago-queries';
import { Paginado } from 'src/common/interface/paginado';
import { MetodoPagoRowDTO } from './dto/metodoPagoRowDTO';
import { FiltroBase } from 'src/common/interface/filtroBase';
import { PagoGuardarDTO } from './dto/pagoGuardarDTO';
import { PagoRowDTO } from './dto/pagoRowDTO';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}

  guardarPagoAsync = async (
    data: PagoGuardarDTO,
  ): Promise<RespuestaGenerica> => {
    const { id_pago, id_pedido, id_metodo, estado } = data;

    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      PagoQueries.guardarPago,
      id_pago ?? null,
      id_pedido,
      id_metodo,
      estado,
    );

    return result[0];
  };

  cancelarPagoAsync = async (id: number): Promise<RespuestaGenerica> => {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      PagoQueries.cancelarPago,
      id,
    );

    return result[0];
  };

  listarPagosAsync = async (
    params: FiltroBase,
  ): Promise<Paginado<PagoRowDTO>> => {
    const {
      busqueda = null,
      estado = undefined,
      ordenCol = 'nombre',
      ordenDir = 'ASC',
      pageIndex = 1,
      pageSize = 10,
    } = params;

    const parsedEstado =
      estado !== undefined ? parseInt(String(estado), 10) : null;
    const parsedPageIndex = parseInt(String(pageIndex), 10);
    const parsedPageSize = parseInt(String(pageSize), 10);

    const result = await this.prisma.$queryRawUnsafe<PagoRowDTO[]>(
      PagoQueries.listarPagos,
      busqueda,
      parsedEstado,
      ordenCol,
      ordenDir,
      parsedPageIndex,
      parsedPageSize,
    );

    const data = result.map((row) => {
      const {
        id_pago,
        id_pedido,
        fecha,
        monto,
        nombre_metodo,
        metodo_estado,
        pedido_cantidad,
        pedido_precio,
        id_metodo,
        estado,
        total_rows,
      } = row;
      return {
        id_pago,
        id_pedido,
        fecha,
        monto,
        nombre_metodo,
        metodo_estado,
        pedido_cantidad,
        pedido_precio,
        id_metodo,
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

  guardarMetodoPagoAsync = async (
    data: MetodoPagoGuardarDTO,
  ): Promise<RespuestaGenerica> => {
    const { id_metodo, nombre, estado = 1 } = data;

    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      MetodoPagoQueries.guardarMetodoPago,
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
      MetodoPagoQueries.deshabilitarMetodoPago,
      id,
    );

    return result[0];
  };

  habilitarMetodoPagoAsync = async (
    id: number,
  ): Promise<RespuestaGenerica> => {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      MetodoPagoQueries.habilitarMetodoPago,
      id,
    );

    return result[0];
  };


  buscarTodosMetosPagoAsync = async (
    params: FiltroBase,
  ): Promise<Paginado<FiltroBase>> => {
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
      MetodoPagoQueries.buscarTodosMetodosPago,
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
