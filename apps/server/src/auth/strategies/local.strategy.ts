import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ValidateUserDto } from '../dto/validate-user.dto';
import { AuthenticatedUser } from '../types/authenticatedUser.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'correo' });
  }

  async validate(
    correo: string,
    password: string,
    rol: string,
  ): Promise<AuthenticatedUser> {
    const dto: ValidateUserDto = { correo, password, rol };
    return this.authService.validateUser(dto);
  }
}
