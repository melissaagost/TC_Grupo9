import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { menu } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenu } from './dto/CreateMenu.dto';
import { Estado } from 'src/common/enums/estado.enum';
import { UpdateMenu } from './dto/UpdateMenu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createMenu(data: CreateMenu): Promise<menu> {
    const menu = await this.prisma.menu.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: Estado.ACTIVO,
      },
    });

    return menu;
  }

  async updateMenu(id: number, data: UpdateMenu): Promise<menu> {
    const menuUpdate = await this.prisma.menu
      .update({
        where: { id_menu: id },
        data,
      })
      .catch(() => {
        throw new BadRequestException('No pudo actualizarse el menu');
      });
    return menuUpdate;
  }

  async findOneMenu(id: number): Promise<menu | null> {
    const menu = await this.prisma.menu
      .findUnique({ where: { id_menu: id } })
      .catch(() => {
        throw new NotFoundException('No se encontro menu');
      });

    return menu;
  }

  async setDisableMenu(id: number): Promise<boolean> {
    const findMenu = await this.findOneMenu(id);

    if (!findMenu) {
      throw new NotFoundException('No se encontro menu');
    }
    await this.prisma.menu.update({
      where: { id_menu: id },
      data: { estado: Estado.INACTIVO },
    });
    return true;
  }

  async findAllMenu(): Promise<menu[]> {
    const menu = await this.prisma.menu.findMany().catch(() => {
      throw new NotFoundException('No se encontraron menu');
    });

    return menu;
  }
}
