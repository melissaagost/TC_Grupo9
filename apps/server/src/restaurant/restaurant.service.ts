import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { restaurante } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRestaurant } from './dto/CreateRestaurant.dto';
import { RestaurantQueries } from './queries/restaurant-queries';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  async createRestaurant(data: CreateRestaurant): Promise<restaurante> {
    try {
      const result = await this.prisma.$queryRawUnsafe<restaurante[]>(
        RestaurantQueries.create,
        data.nombre,
        data.direccion,
        data.telefono,
        data.email,
        data.id_menu,
      );
      return result[0];
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al crear restaurante');
    }
  }

  async updateRestaurant(id: number, data: CreateRestaurant): Promise<string> {
    try {
      const result = await this.prisma.$queryRawUnsafe<
        { sp_update_restaurante: string }[]
      >(
        RestaurantQueries.update,
        id,
        data.nombre,
        data.direccion,
        data.telefono,
        data.email,
        data.id_menu,
      );
      return result[0].sp_update_restaurante;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al actualizar restaurante');
    }
  }

  async findOneRestaurant(id: number): Promise<restaurante> {
    const result = await this.prisma.$queryRawUnsafe<restaurante[]>(
      RestaurantQueries.find,
      id,
    );

    if (!result.length) {
      throw new NotFoundException('Restaurante no encontrado');
    }
    return result[0];
  }
}
