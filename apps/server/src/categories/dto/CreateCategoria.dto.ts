import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoria {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  descripcion: string;
}
