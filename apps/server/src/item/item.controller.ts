import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemRowDTO } from './dto/itemRowDTO';
import { FiltroBase } from 'src/common/interface/filtroBase';
// import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ItemGuardarDTO } from './dto/itemGuardarDTO';
import { Paginado } from 'src/common/interface/paginado';

@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('listar')
  async listarItems(@Query() query: FiltroBase): Promise<Paginado<ItemRowDTO>> {
    try {
      return await this.itemService.listarItemsAsync(query);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al listar items', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('buscar/:id')
  async buscarItemPorId(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.itemService.buscarItemPorIdAsync(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al buscar item', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('deshabilitar/:id')
  async deshabilitarItem(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.itemService.deshabilitarItemAsync(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al deshabilitar item', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('guardar')
  async guardarItem(@Body() data: ItemGuardarDTO) {
    try {
      return this.itemService.guardarItemAsync(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al guardar item', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
