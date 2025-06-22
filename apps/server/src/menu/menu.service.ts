import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { menu } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMenu } from './dto/UpdateMenu.dto';
import { MenuQueries } from './queries/menu-queries';
@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createMenu(data: UpdateMenu): Promise<menu> {
    try {
      const [menuCreated] = await this.prisma.$queryRawUnsafe<menu[]>(
        MenuQueries.create,
        data.nombre,
        data.descripcion,
      );

      if (!menuCreated) {
        throw new BadRequestException('No se pudo crear el menú');
      }

      return menuCreated;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al crear el menú');
    }
  }

  async updateMenu(id: number, data: UpdateMenu): Promise<{ message: string }> {
    try {
      const result = await this.prisma.$queryRawUnsafe<
        { sp_update_menu: string }[]
      >(
        `SELECT restaurant.sp_update_menu($1, $2, $3)`,
        id,
        data.nombre,
        data.descripcion,
      );

      if (!result.length) {
        throw new BadRequestException(
          'No se recibió respuesta al actualizar el menú',
        );
      }

      return { message: result[0].sp_update_menu };
    } catch (error) {
      throw new BadRequestException(error || 'Error al actualizar el menú');
    }
  }

  async findOneMenu(id: number): Promise<menu> {
    try {
      const [menuFound] = await this.prisma.$queryRawUnsafe<menu[]>(
        MenuQueries.findOne,
        id,
      );

      if (!menuFound) {
        throw new NotFoundException('Menú no encontrado');
      }

      return menuFound;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al buscar el menú');
    }
  }

  async setDisableMenu(id: number): Promise<{ message: string }> {
    try {
      const result = await this.prisma.$queryRawUnsafe<
        { sp_disable_menu: string }[]
      >(`SELECT restaurant.sp_disable_menu($1)`, id);

      if (!result.length) {
        throw new BadRequestException(
          'No se recibió respuesta al desactivar el menú',
        );
      }

      return { message: result[0].sp_disable_menu };
    } catch (error) {
      throw new BadRequestException(error || 'Error al desactivar el menú');
    }
  }

   async setEnableMenu(id: number): Promise<{ message: string }> {
    try {
      const result = await this.prisma.$queryRawUnsafe<
        { sp_enable_menu: string }[]
      >(`SELECT restaurant.sp_enable_menu($1)`, id);

      if (!result.length) {
        throw new BadRequestException(
          'No se recibió respuesta al activar el menú',
        );
      }

      return { message: result[0].sp_enable_menu };
    } catch (error) {
      throw new BadRequestException(error || 'Error al activar el menú');
    }
  }

 async findAllMenu(): Promise<menu[]> {
  try {
    const menu = await this.prisma.menu.findMany({
      orderBy: {
        id_menu: 'asc', // o 'desc' si querés orden descendente
      },
    });

    if (!menu.length) {
      throw new NotFoundException('No se encontraron menús');
    }

    return menu;
  } catch (error) {
    throw new NotFoundException('Error al obtener menús');
  }
}

}
