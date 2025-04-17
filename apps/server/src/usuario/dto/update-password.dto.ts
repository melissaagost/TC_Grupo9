import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La clave debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La clave debe contener al menos una letra mayúscula y un número.',
  })
  newPassword: string;
}
