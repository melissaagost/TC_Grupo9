import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/auth/types/authenticatedUser.type';
import { categoria } from '@prisma/client';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateCategoria } from './dto/UpdateCategorie.dto';
import { CreateCategoria } from './dto/CreateCategoria.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoria: CategoriesService) {}

  // Metodos publicos
  @Get()
  findAllCategorias(): Promise<categoria[]> {
    return this.categoria.findAllCategories();
  }

  @Get(':id')
  findOneCategorie(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<categoria | null> {
    return this.categoria.findOneCategoria(id);
  }

  // Metodos privados
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Administrador)
  @Post()
  createCategoria(@Body() data: CreateCategoria): Promise<categoria> {
    return this.categoria.createCategorie(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Administrador)
  @Patch(':id/update')
  updateCategoria(@Body() data: UpdateCategoria, @Param('id') id: number) {
    return this.categoria.updateCategoria(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Administrador)
  @Patch(':id/disable')
  disableCategoria(@Param() id: number) {
    return this.categoria.setDisableCategoria(id);
  }
}
