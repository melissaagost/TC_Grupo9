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
import { MenuService } from './menu.service';
import { UpdateMenu } from './dto/UpdateMenu.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/auth/types/authenticatedUser.type';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { menu } from '@prisma/client';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOneMenu(id);
  }

  // metodos privados

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  createMenuAsync(@Body() data: UpdateMenu) {
    return this.menuService.createMenu(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Patch(':id')
  async updateMenuAsync(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMenu,
  ): Promise<{ message: string }> {
    return this.menuService.updateMenu(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get()
  async findAllMenu(): Promise<menu[]> {
    return await this.menuService.findAllMenu();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Patch(':id/disable')
  async disableMenu(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.menuService.setDisableMenu(id);
  }
}
