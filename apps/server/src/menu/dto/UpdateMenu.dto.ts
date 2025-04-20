import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMenu {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  descripcion: string;
}
