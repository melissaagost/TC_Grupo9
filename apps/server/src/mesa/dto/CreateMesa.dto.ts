import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMesaDTO {
  @IsNumber()
  @IsNotEmpty()
  numero: number;

  @IsNumber()
  @IsNotEmpty()
  capacidad: number;

  @IsString()
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  id_restaurante: number;
}
