import { Injectable } from '@nestjs/common';
import { RespuestaGenerica } from 'src/common/interface/respuestaGenerica';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemQueries } from './queries/item-queries';
import { ItemGuardarDTO } from './dto/itemGuardarDTO';
import { FiltroBase } from 'src/common/interface/filtroBase';
import { ItemRowDTO } from './dto/itemRowDTO';
import { Paginado } from 'src/common/interface/paginado';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async buscarItemPorIdAsync(id: number): Promise<RespuestaGenerica> {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      ItemQueries.buscarPorId,
      id,
    );

    return result[0];
  }

  async deshabilitarItemAsync(id: number): Promise<RespuestaGenerica> {
    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      ItemQueries.deshabilitarItem,
      id,
    );

    return result[0];
  }

  async listarItemsAsync(filtro: FiltroBase): Promise<Paginado<ItemRowDTO>> {
    const {
      busqueda = null,
      estado = 1,
      ordenCol = 'nombre',
      ordenDir = 'DESC',
      pageIndex = 1,
      pageSize = 10,
    } = filtro;

    const parsedEstado =
      estado !== undefined ? parseInt(String(estado), 10) : null;
    const parsedPageIndex = parseInt(String(pageIndex), 10);
    const parsedPageSize = parseInt(String(pageSize), 10);

    const result = await this.prisma.$queryRawUnsafe<ItemRowDTO[]>(
      ItemQueries.listarItems,
      busqueda,
      parsedEstado,
      ordenCol,
      ordenDir,
      parsedPageIndex,
      parsedPageSize,
    );

    const data = result.map((row) => {
      const {
        id_item,
        nombre,
        descripcion,
        stock,
        precio,
        estado,
        id_categoria,
        id_menu,
        total_rows,
      } = row;
      return {
        id_item,
        nombre,
        descripcion,
        stock,
        precio,
        estado,
        id_categoria,
        id_menu,
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
  }

  async guardarItemAsync(data: ItemGuardarDTO): Promise<RespuestaGenerica> {
    const {
      id_item,
      nombre,
      descripcion,
      stock,
      precio,
      estado,
      id_categoria,
      id_menu,
    } = data;

    const result = await this.prisma.$queryRawUnsafe<RespuestaGenerica[]>(
      ItemQueries.guardarItem,
      id_item ?? null,
      nombre,
      descripcion,
      stock,
      precio,
      estado,
      id_categoria,
      id_menu,
    );

    return result[0];
  }
}
