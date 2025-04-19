import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoria {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  descripcion: string;
}
