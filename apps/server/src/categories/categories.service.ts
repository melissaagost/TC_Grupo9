import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { categoria } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Estado } from 'src/common/enums/estado.enum';
import { UpdateCategoria } from './dto/UpdateCategorie.dto';
import { CreateCategoria } from './dto/CreateCategoria.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategorie(data: CreateCategoria): Promise<categoria> {
    if (!data.nombre?.trim()) {
      throw new BadRequestException('El nombre es obligatorio');
    }

    if (!data.descripcion?.trim()) {
      throw new BadRequestException('La descripción es obligatoria');
    }

    try {
      const categoria = await this.prisma.categoria.create({
        data: {
          nombre: data.nombre.trim(),
          descripcion: data.descripcion.trim(),
          estado: Estado.ACTIVO,
        },
      });
      return categoria;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
      throw new InternalServerErrorException('Error al crear la categoría');
    }
  }

 async findAllCategories(): Promise<categoria[]> {
  const categories = await this.prisma.categoria.findMany({
    orderBy: {
      id_categoria: 'asc', // Podés usar 'desc' si querés orden descendente
    },
  });

  return categories || [];
}





  async findOneCategoria(id: number): Promise<categoria | null> {
    return await this.prisma.categoria.findUnique({
      where: { id_categoria: id },
    });
  }

  async updateCategoria(id: number, data: UpdateCategoria): Promise<categoria> {
    const findCategoria = await this.findOneCategoria(id);
    if (!findCategoria)
      throw new NotFoundException('No se encuentra la categoría');

    try {
      const updatedCategoria = await this.prisma.categoria.update({
        where: { id_categoria: id },
        data,
      });
      return updatedCategoria;
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la categoría');
    }
  }

  async setDisableCategoria(id: number): Promise<categoria> {
    const findCategoria = await this.findOneCategoria(id);
    if (!findCategoria)
      throw new NotFoundException('No se encuentra la categoría');

    try {
      return await this.prisma.categoria.update({
        where: { id_categoria: id },
        data: { estado: Estado.INACTIVO },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al desactivar la categoría');
    }
  }

  async setEnableCategoria(id: number): Promise<categoria> {
    const findCategoria = await this.findOneCategoria(id);
    if (!findCategoria)
      throw new NotFoundException('No se encuentra la categoría');

    try {
      return await this.prisma.categoria.update({
        where: { id_categoria: id },
        data: { estado: Estado.ACTIVO },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al activar la categoría');
    }
  }
}
