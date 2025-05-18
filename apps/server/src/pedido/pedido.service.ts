import { Injectable } from '@nestjs/common';
import { RespuestaGenerica } from 'src/common/interface/respuestaGenerica';
import { PrismaService } from 'src/prisma/prisma.service';
import { PedidoQueries } from './queries/pedido-queries';
import { PedidoCompletoGuardarDTO } from './dto/itemGuardarDTO';
import { FiltroBase } from 'src/common/interface/filtroBase';
import { PedidoRowDTO } from './dto/pedidoRowDTO';
import { Paginado } from 'src/common/interface/paginado';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPedidoPorIdAsync(id: number): Promise<RespuestaGenerica> {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      PedidoQueries.buscarPorId,
      id,
    );

    return result[0];
  }

  async cancelarPedidoAsync(id: number): Promise<RespuestaGenerica> {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      PedidoQueries.cancelarPedido,
      id,
    );

    return result[0];
  }

  async guardarPedidoCompletoAsync(
    data: PedidoCompletoGuardarDTO,
  ): Promise<RespuestaGenerica> {
    const { id_pedido, id_usuario, id_mesa, items } = data;

    // Convertir el array de items a formato JSONB
    const itemsJsonb = JSON.stringify(items);

    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      PedidoQueries.guardarPedidoCompleto,
      id_pedido ?? null,
      id_usuario,
      id_mesa,
      itemsJsonb,
    );

    return result[0];
  }

  async listarPedidoCompletoAsync(
    filtro: FiltroBase,
  ): Promise<Paginado<PedidoRowDTO>> {
    // Desestructurar valores con valores predeterminados
    const {
      busqueda = null,
      estado = null,
      ordenCol = null,
      ordenDir = null,
      pageIndex = null,
      pageSize = null,
    } = filtro;

    // Parsear valores de manera segura
    const parsedEstado =
      estado !== undefined && estado !== null
        ? parseInt(String(estado), 10)
        : null;
    const parsedPageIndex =
      pageIndex !== null ? parseInt(String(pageIndex), 10) : 1;
    const parsedPageSize =
      pageSize !== null ? parseInt(String(pageSize), 10) : 10;

    // Ejecutar la consulta con los parámetros
    const result = await this.prisma.$queryRawUnsafe<PedidoRowDTO[]>(
      PedidoQueries.listarPedidoCompleto,
      busqueda,
      parsedEstado,
      ordenCol || 'id_pedido',
      ordenDir || 'DESC',
      parsedPageIndex,
      parsedPageSize,
    );

    // Mapear y transformar los resultados
    const data = result.map((row) => {
      const {
        id_pedido,
        cantidad_total,
        precio_total,
        estado_pedido,
        estado_descripcion,
        fecha,
        id_mesa,
        numero_mesa,
        descripcion_mesa,
        id_usuario,
        usuario_nombre,
        tipo_usuario,
        id_item,
        nombre_item,
        descripcion_item,
        cantidad_item,
        subtotal_item,
        total_rows,
      } = row;

      return {
        id_pedido,
        cantidad_total,
        precio_total,
        estado_pedido,
        estado_descripcion,
        fecha,
        id_mesa,
        numero_mesa,
        descripcion_mesa,
        id_usuario,
        usuario_nombre,
        tipo_usuario,
        id_item,
        nombre_item,
        descripcion_item,
        cantidad_item,
        subtotal_item,
        total_rows: Number(total_rows),
      };
    });

    // Obtener el total de registros
    const total = data.length > 0 ? data[0].total_rows : 0;

    // Retornar objeto paginado
    return {
      data,
      total,
      pageIndex: parsedPageIndex,
      pageSize: parsedPageSize,
    };
  }
}
