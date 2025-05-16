import { Injectable, NotFoundException } from '@nestjs/common';
import { categoria } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Estado } from 'src/common/enums/estado.enum';
import { UpdateCategoria } from './dto/UpdateCategorie.dto';
import { CreateCategoria } from './dto/CreateCategoria.dto';

//TODO Agregar trycatch
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategorie(data: CreateCategoria): Promise<categoria> {
    const categoria = this.prisma.categoria.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: Estado.ACTIVO,
      },
    });
    return categoria;
  }

  async findAllCategories(): Promise<categoria[]> {
    const categories = this.prisma.categoria.findMany();
    if (categories == null) return [];
    return categories;
  }

  async findOneCategoria(id: number): Promise<categoria | null> {
    const categorie = this.prisma.categoria.findUnique({
      where: { id_categoria: id },
    });
    return categorie;
  }

  async updateCategoria(id: number, data: UpdateCategoria): Promise<categoria> {
    const findCategoria = this.findOneCategoria(id);
    if (findCategoria === null)
      throw new NotFoundException('No se encuentra categoria');

    const updatedCategoria = this.prisma.categoria.update({
      where: { id_categoria: id },
      data,
    });

    return updatedCategoria;
  }

  async setDisableCategoria(id: number): Promise<categoria> {
    const findCategoria = this.findOneCategoria(id);
    if (findCategoria === null)
      throw new NotFoundException('No se encuentra categoria');

    const updatedCategoria = this.prisma.categoria.update({
      where: { id_categoria: id },
      data: { estado: Estado.INACTIVO },
    });

    return updatedCategoria;
  }

    async setEnableCategoria(id: number): Promise<categoria> {
    const findCategoria = this.findOneCategoria(id);
    if (findCategoria === null)
      throw new NotFoundException('No se encuentra categoria');

    const updatedCategoria = this.prisma.categoria.update({
      where: { id_categoria: id },
      data: { estado: Estado.ACTIVO },
    });

    return updatedCategoria;
  }
}
