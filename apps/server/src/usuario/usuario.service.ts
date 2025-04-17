import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario, TipoUsuario } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

enum Estado {
  ACTIVO = 1,
  INACTIVO = 0,
}

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos(): Promise<(Usuario & { tipoUsuario: TipoUsuario })[]> {
    const usuarios = await this.prisma.usuario.findMany({
      include: { tipoUsuario: true },
    });
    return usuarios;
  }

  async createUser(data: CreateUserDto): Promise<Usuario> {
    const hashedPass: string = await bcrypt.hash(data.password, 10);

    return await this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        correo: data.correo,
        password: hashedPass,
        id_tipousuario: data.tipoUsuarioId,
        estado: Estado.ACTIVO,
      },
    });
  }

  async findProfile(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        estado: true,
        tipoUsuario: {
          select: { descripcion: true },
        },
      },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async findByMail(mail: string): Promise<Usuario> {
    const user = await this.prisma.usuario.findUnique({
      where: { correo: mail },
      include: { tipoUsuario: true },
    });
    if (!user) {
      throw new NotFoundException(`Usuario ${mail} no encontrado`);
    }
    return user;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<Usuario> {
    return await this.prisma.usuario.update({
      where: { id_usuario: id },
      data,
    });
  }

  async setInactive(id: number): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: {
        estado: Estado.INACTIVO,
      },
    });
  }

  async updatePassword(id: number, data: UpdatePasswordDto): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const passwordMatches = await bcrypt.compare(
      data.newPassword,
      usuario.password,
    );
    if (passwordMatches) {
      throw new BadRequestException(
        'La clave no puede ser igual a la anterior',
      );
    }

    const hashedPass = await bcrypt.hash(data.newPassword, 10);
    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: { password: hashedPass },
    });
  }
}
