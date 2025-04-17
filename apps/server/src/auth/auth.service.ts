import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthenticatedUser } from './types/authenticatedUser.type';
import { Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: ValidateUserDto): Promise<AuthenticatedUser> {
    const { correo, password } = login;
    const user: Usuario | null = await this.usuarioService.findByMail(correo);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result as AuthenticatedUser;
  }

  async login(user: AuthenticatedUser): Promise<{ access_token: string }> {
    const payload = {
      mail: user.correo,
      sub: user.id_usuario,
      rol: user.tipoUsuario.descripcion,
    };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    return {
      access_token: token,
    };
  }
}
