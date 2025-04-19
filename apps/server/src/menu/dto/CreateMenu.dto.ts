import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMenu {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  descripcion: string;
}
