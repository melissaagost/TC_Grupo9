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
import { categoria } from '@prisma/client';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/auth/types/authenticatedUser.type';
import { UpdateCategoria } from './dto/UpdateCategorie.dto';
import { CreateCategoria } from './dto/CreateCategoria.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Métodos públicos
  @Get()
  findAllCategorias(): Promise<categoria[]> {
    return this.categoriesService.findAllCategories();
  }

  @Get(':id')
  findOneCategorie(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<categoria | null> {
    return this.categoriesService.findOneCategoria(id);
  }

  // Métodos privados (con rol de administrador)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  createCategoria(@Body() data: CreateCategoria): Promise<categoria> {
    return this.categoriesService.createCategorie(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Patch(':id/update')
  updateCategoria(
    @Body() data: UpdateCategoria,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<categoria> {
    return this.categoriesService.updateCategoria(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Patch(':id/disable')
  disableCategoria(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<categoria> {
    return this.categoriesService.setDisableCategoria(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Patch(':id/enable')
  enableCategoria(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<categoria> {
    return this.categoriesService.setEnableCategoria(id);
  }
}
