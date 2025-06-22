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

  async buscarPedidoPorIdAsync(id: number): Promise<PedidoRowDTO[]> {
    //const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
    const result = await this.prisma.$queryRawUnsafe<PedidoRowDTO[]>(
      PedidoQueries.buscarPorId,
      id,
    );

    return result;
  }

  async cancelarPedidoAsync(id: number): Promise<RespuestaGenerica> {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      PedidoQueries.cancelarPedido,
      id,
    );

    // Obtener la mesa asociada al pedido
    const pedido = await this.prisma.pedido.findUnique({
      where: { id_pedido: id },
      select: { id_mesa: true },
    });

    //Actualizar la mesa a estado libre (0)
    if (pedido?.id_mesa) {
      await this.prisma.mesa.update({
        where: { id_mesa: pedido.id_mesa },
        data: { estado: 0 },
      });
    }

    return result[0];
  }

  async actualizarEstadoPedidoAsync(
    id_pedido: number,
    nuevo_estado: number,
  ): Promise<RespuestaGenerica> {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      `
  SELECT * FROM restaurant.actualizar_estado_pedido(
    ${id_pedido}::INTEGER,
    ${nuevo_estado}::INTEGER
  );
  `,
    );

    return result[0];
  }

  async guardarPedidoCompletoAsync(
    data: PedidoCompletoGuardarDTO,
  ): Promise<RespuestaGenerica> {
    const { id_pedido, id_usuario, id_mesa, items } = data;

    // Convertir el array de items a formato JSONB
    const itemsJsonb = JSON.stringify(items);

    const result = await this.prisma.$queryRawUnsafe<
      { result: RespuestaGenerica }[]
    >(
      PedidoQueries.guardarPedidoCompleto,
      id_pedido ?? null,
      id_usuario,
      id_mesa,
      itemsJsonb,
    );

    // Cambiar estado de la mesa a "ocupada" (1)
    await this.prisma.mesa.update({
      where: { id_mesa },
      data: { estado: 1 },
    });

    return result[0].result;
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
