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
import { PedidoService } from './pedido.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/auth/types/authenticatedUser.type';
import { PedidoCompletoGuardarDTO } from './dto/itemGuardarDTO';
import { FiltroBase } from 'src/common/interface/filtroBase';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pedido')
export class PedidoController {
  constructor(private pedidoService: PedidoService) {}

  @Roles(Role.Administrador, Role.Mozo)
  @Get('buscar/:id')
  async buscarPedidoPorId(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.pedidoService.buscarPedidoPorIdAsync(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al buscar pedido', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(Role.Administrador, Role.Mozo)
  @Patch('cancelar/:id')
  async cancelarPedido(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.pedidoService.cancelarPedidoAsync(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al cancelar el pedido', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(Role.Administrador, Role.Mozo)
  @Post('guardar')
  async guardarPedidoCompleto(@Body() dto: PedidoCompletoGuardarDTO) {
    try {
      return await this.pedidoService.guardarPedidoCompletoAsync(dto);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al guardar el pedido', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(Role.Administrador, Role.Mozo)
  @Get('listar')
  async listarPedidoCompleto(@Query() query: FiltroBase) {
    try {
      return await this.pedidoService.listarPedidoCompletoAsync(query);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al listar pedidos', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
