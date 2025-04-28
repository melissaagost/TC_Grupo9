import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDTO } from './dto/CreateMesa.dto';
import { mesa } from '@prisma/client';

@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  async createMesa(@Body() data: CreateMesaDTO): Promise<mesa> {
    return this.mesaService.createMesa(data);
  }

  @Patch(':id')
  async updateMesa(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateMesaDTO,
  ): Promise<mesa> {
    return this.mesaService.updateMesa(id, data);
  }

  @Get()
  async findAllMesa(): Promise<{ data: mesa[] }> {
    const mesas = await this.mesaService.findAllMesa();
    return { data: mesas };
  }

  @Get(':id')
  async findOneMesa(@Param('id', ParseIntPipe) id: number): Promise<mesa> {
    return this.mesaService.findOneMesa(id);
  }

  @Patch(':id/libre')
  async setEstadoLibre(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.mesaService.setEstadoLibre(id);
  }

  @Patch(':id/ocupado')
  async setEstadoOcupado(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.mesaService.setEstadoOcupado(id);
  }
}
