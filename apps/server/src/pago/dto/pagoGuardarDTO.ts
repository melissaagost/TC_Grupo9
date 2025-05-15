import { IsInt, IsOptional } from 'class-validator';

export class PagoGuardarDTO {
  @IsInt()
  @IsOptional()
  id_pago?: number;
  @IsInt()
  id_pedido: number;
  @IsInt()
  id_metodo: number;
  @IsInt()
  estado: number;
}
