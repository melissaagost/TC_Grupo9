import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMesaDTO } from './dto/CreateMesa.dto';
import { mesa } from '@prisma/client';
import { MesaQueries } from './queries/mesa-queries';

@Injectable()
export class MesaService {
  constructor(private readonly prisma: PrismaService) {}

  async createMesa(data: CreateMesaDTO): Promise<mesa> {
    try {
      const result = await this.prisma.$queryRawUnsafe<mesa[]>(
        MesaQueries.create,
        data.numero,
        data.capacidad,
        data.descripcion,
        data.id_restaurante,
      );
      return result[0];
    } catch (error) {
      throw new BadRequestException(error || 'Error al crear la mesa');
    }
  }

  async updateMesa(id: number, data: CreateMesaDTO): Promise<mesa> {
    try {
      const result = await this.prisma.$queryRawUnsafe<mesa[]>(
        MesaQueries.update,
        id,
        data.numero,
        data.capacidad,
        data.descripcion,
      );

      if (!result.length) {
        throw new NotFoundException('Mesa no encontrada para actualizar');
      }

      return result[0];
    } catch (error) {
      throw new BadRequestException(error || 'Error al actualizar la mesa');
    }
  }

    //obtener mesas que tengan pedidos
   async obtenerMesasConPedidoActivo() {
    return await this.prisma.$queryRawUnsafe(`
      SELECT
        m.id_mesa,
        m.numero,
        m.capacidad,
        m.descripcion,
        m.estado AS estado_mesa,
        p.id_pedido,
        p.estado AS estado_pedido
      FROM restaurant.mesa m
      LEFT JOIN LATERAL (
        SELECT p.id_pedido, p.estado
        FROM restaurant.pedido p
        WHERE p.id_mesa = m.id_mesa
          AND p.estado NOT IN (0, 2) -- Excluir cancelado y pagado
        ORDER BY p.id_pedido DESC
        LIMIT 1
      ) p ON true
      ORDER BY m.numero;
    `);
  }

  async findAllMesa(): Promise<mesa[]> {
    try {
      const mesas = await this.prisma.$queryRawUnsafe<mesa[]>(
        MesaQueries.findAll,
      );
      return mesas;
    } catch (error) {
      throw new NotFoundException(error || 'No se pudieron obtener las mesas');
    }
  }

  async findOneMesa(id: number): Promise<mesa> {
    try {
      const result = await this.prisma.$queryRawUnsafe<mesa[]>(
        MesaQueries.findById,
        id,
      );

      if (!result.length) {
        throw new NotFoundException('Mesa no encontrada');
      }

      return result[0];
    } catch (error) {
      throw new BadRequestException(error || 'Error al buscar la mesa');
    }
  }
  async setEstadoLibre(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.$executeRawUnsafe(MesaQueries.setEstadoLibre, id);
      return { message: 'Mesa liberada exitosamente' };
    } catch (error) {
      throw new BadRequestException(error || 'Error al liberar la mesa');
    }
  }

  async setEstadoOcupado(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.$executeRawUnsafe(MesaQueries.setEstadoOcupado, id);
      return { message: 'Mesa ocupada exitosamente' };
    } catch (error) {
      throw new BadRequestException(error || 'Error al ocupar la mesa');
    }
  }

    async setEstadoReservado(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.$executeRawUnsafe(MesaQueries.setEstadoReservado, id);
      return { message: 'Mesa reservada exitosamente' };
    } catch (error) {
      throw new BadRequestException(error || 'Error al reservar la mesa');
    }
  }


}
