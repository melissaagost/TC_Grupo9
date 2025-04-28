import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsuarioQueries } from './queries/usuario-queries';
import { UsuarioConTipo, UsuarioPerfil } from './interfaces/usuario.interface';
import { UsuarioWithRol } from './interfaces/UsuarioRol.interface';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<Usuario> {
    const hashedPass = await bcrypt.hash(data.password, 10);

    try {
      const result = await this.prisma.$queryRawUnsafe<Usuario[]>(
        UsuarioQueries.create,
        data.nombre,
        data.correo,
        hashedPass,
        data.tipoUsuarioId,
      );

      return result[0];
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('correo')) {
        throw new BadRequestException('Correo ya registrado');
      }

      console.error(error);
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async obtenerTodos(): Promise<UsuarioConTipo[]> {
    try {
      const usuarios = await this.prisma.$queryRawUnsafe<UsuarioConTipo[]>(
        UsuarioQueries.getAll,
      );
      return usuarios;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al listar usuarios');
    }
  }

  async findProfile(id: number): Promise<UsuarioPerfil> {
    const result = await this.prisma.$queryRawUnsafe<UsuarioPerfil[]>(
      UsuarioQueries.findProfile,
      id,
    );

    if (!result.length) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return result[0];
  }

  async findByMail(mail: string): Promise<UsuarioWithRol> {
    const user = await this.prisma.usuario.findUnique({
      where: { correo: mail },
      select: {
        id_usuario: true,
        correo: true,
        password: true,
        estado: true,
        id_restaurante: true,
        tipoUsuario: { select: { descripcion: true } },
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario ${mail} no encontrado`);
    }
    return user;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<UsuarioPerfil> {
    try {
      await this.prisma.$executeRawUnsafe(
        UsuarioQueries.update,
        id,
        data.nombre,
        data.correo,
        data.tipoUsuarioId,
        data.estado,
      );

      const result = await this.prisma.$queryRawUnsafe<UsuarioPerfil[]>(
        UsuarioQueries.findProfile,
        id,
      );

      if (!result.length) {
        throw new NotFoundException('Usuario actualizado no encontrado');
      }

      return result[0];
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes('no encontrado')
      ) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException('Error al actualizar el usuario');
    }
  }

  async setInactive(authUserId: number, targetUserId: number): Promise<void> {
    if (authUserId === targetUserId) {
      throw new BadRequestException('No podés desactivarte a vos mismo');
    }

    try {
      await this.prisma.$executeRawUnsafe(
        UsuarioQueries.setInactive,
        targetUserId,
      );
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes('no encontrado')
      ) {
        throw new NotFoundException(
          `Usuario con ID ${targetUserId} no encontrado`,
        );
      }

      throw new BadRequestException('Error al desactivar el usuario');
    }
  }

  async updatePassword(
    id: number,
    data: UpdatePasswordDto,
  ): Promise<{ message: string; correo: string }> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      usuario.password,
    );

    if (passwordMatches) {
      throw new BadRequestException(
        'La clave no puede ser igual a la anterior',
      );
    }

    const hashedPass = await bcrypt.hash(data.password, 10);

    try {
      await this.prisma.$executeRawUnsafe(
        UsuarioQueries.updatePassword, // ← SELECT auth.sp_update_password($1::int, $2::text)
        id,
        hashedPass,
      );

      return {
        message: 'Clave actualizada con éxito',
        correo: usuario.correo,
      };
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes('no encontrado')
      ) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException('Error al actualizar la contraseña');
    }
  }
}
