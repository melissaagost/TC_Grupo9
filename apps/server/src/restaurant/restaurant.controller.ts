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
import { RestaurantService } from './restaurant.service';
import { CreateRestaurant } from './dto/CreateRestaurant.dto';
import { restaurante } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/auth/types/authenticatedUser.type';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Administrador)
  @Post()
  createRestaurant(@Body() data: CreateRestaurant): Promise<restaurante> {
    return this.restaurantService.createRestaurant(data);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Administrador)
  @Patch(':id')
  updateRestaurant(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateRestaurant,
  ): Promise<string> {
    return this.restaurantService.updateRestaurant(id, data);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Administrador)
  @Get(':id')
  findRestaurant(@Param('id', ParseIntPipe) id: number): Promise<restaurante> {
    return this.restaurantService.findOneRestaurant(id);
  }
}
