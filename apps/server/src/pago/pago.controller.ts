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
import { PagoService } from './pago.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/auth/types/authenticatedUser.type';
import { MetodoPagoGuardarDTO } from './dto/metodoPagoGuardarDTO';
import { MetodoPagoBuscarTodos } from './interfaces/metodoPagoFind.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pago')
export class PagoController {
  constructor(private pagoService: PagoService) {}

  @Roles(Role.Administrador)
  @Post('guardar_metodo_pago')
  async guardarMetodoPago(@Body() dto: MetodoPagoGuardarDTO) {
    try {
      return await this.pagoService.guardarMetodoPagoAsync(dto);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al guardar metodo pago', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(Role.Administrador)
  @Patch('deshabilitar_metodo_pago/:id')
  async deshabilitar(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.pagoService.deshabilitarMetodoPagoAsync(id);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al deshabilitar método de pago', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('buscar_metodo_pago')
  async buscar(@Query() query: MetodoPagoBuscarTodos) {
    try {
      return await this.pagoService.buscarTodosMetosPagoAsync(query);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        { message: 'Error al buscar métodos de pago', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
