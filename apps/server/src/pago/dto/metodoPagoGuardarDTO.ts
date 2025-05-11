import { IsInt, IsOptional, IsString } from 'class-validator';

export class MetodoPagoGuardarDTO {
  @IsInt()
  @IsOptional()
  id_metodo?: number;

  @IsString()
  nombre: string;

  // Opcional, 0 o 1
  @IsInt()
  estado?: number;
}
