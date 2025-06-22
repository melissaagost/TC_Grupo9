import { IsInt, IsString } from 'class-validator';

export class MetodoPagoRowDTO {
  @IsInt()
  id_metodo: number;

  @IsString()
  nombre: string;

  @IsInt()
  estado: number;

  @IsInt()
  total_rows: number;
}
