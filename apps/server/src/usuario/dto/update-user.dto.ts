import { IsString, IsEmail, IsInt, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsInt()
  @IsOptional()
  tipoUsuarioId?: number;

  @IsInt()
  @IsOptional()
  estado?: number;
}
