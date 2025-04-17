import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La clave debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La clave debe contener al menos una letra mayúscula y un número.',
  })
  password: string;

  @IsInt()
  estado: number;

  @IsInt()
  tipoUsuarioId: number;
}
