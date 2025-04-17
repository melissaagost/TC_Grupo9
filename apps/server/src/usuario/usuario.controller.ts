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
import { UsuarioService } from './usuario.service';
import { Usuario, TipoUsuario } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthenticatedUser, Role } from 'src/auth/types/authenticatedUser.type';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';

type userType = Usuario & { tipoUsuario: TipoUsuario };

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Administrador)
  @Get()
  async obtenerTodos(): Promise<{ data: userType[] }> {
    const usuarios = await this.usuarioService.obtenerTodos();
    return { data: usuarios };
  }
  //Endpoint create user
  @Post()
  createUser(@Body() data: CreateUserDto): Promise<Usuario> {
    return this.usuarioService.createUser(data);
  }

  // Endpoint for updateUser
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<Usuario> {
    return this.usuarioService.updateUser(id, data);
  }

  //Endpoint to set inactive
  @Patch(':id/inactive')
  setUserInactive(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.setInactive(id);
  }

  //Endpoint for update password
  @Patch(':id/updatepass')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePasswordDto,
  ): Promise<Usuario> {
    return this.usuarioService.updatePassword(id, data);
  }

  //endpoint get profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: AuthenticatedUser) {
    return this.usuarioService.findProfile(user.id_usuario);
  }
}
