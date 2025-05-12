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
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthenticatedUser, Role } from 'src/auth/types/authenticatedUser.type';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UsuarioConTipo, UsuarioPerfil } from './interfaces/usuario.interface';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(Role.Administrador)
  @Roles('administrador')
  @Get()
  async obtenerTodos(): Promise<{ data: UsuarioConTipo[] }> {
    const usuarios = await this.usuarioService.obtenerTodos();
    return { data: usuarios };
  }
  //Endpoint create user
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(Role.Administrador)
  @Roles('administrador')
  @Post()
  createUser(@Body() data: CreateUserDto): Promise<Usuario> {
    return this.usuarioService.createUser(data);
  }

  // Endpoint for updateUser
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(Role.Administrador)
  @Roles('administrador')
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<UsuarioPerfil> {
    return this.usuarioService.updateUser(id, data);
  }

  //Endpoint to set inactive
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(Role.Administrador)
  @Roles('administrador')
  @Patch(':id/inactive')
  setUserInactive(
    @User() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.usuarioService.setInactive(user.id_usuario, id);
  }

  //Endpoint for update password
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(Role.Administrador)
  @Roles('administrador')
  @Patch(':id/updatepass')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePasswordDto,
  ): Promise<{ message: string; correo: string }> {
    return this.usuarioService.updatePassword(id, data);
  }

  //endpoint get profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: AuthenticatedUser) {
    return this.usuarioService.findProfile(user.id_usuario);
  }

  @Patch('profile') //para editar perfil propio
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOwnProfile(
    @User() user: AuthenticatedUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UsuarioPerfil> {
    return this.usuarioService.updateOwnProfile(user.id_usuario, {
      nombre: dto.nombre,
      correo: dto.correo,
    });
  }


}
