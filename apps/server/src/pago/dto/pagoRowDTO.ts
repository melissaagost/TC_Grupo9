import { IsInt, IsString, IsDate, IsNumber, IsPositive } from 'class-validator';

export class PagoRowDTO {
  @IsInt()
  @IsPositive()
  id_pago: number;

  @IsInt()
  @IsPositive()
  id_pedido: number;

  @IsDate()
  fecha: Date;

  @IsNumber()
  @IsPositive()
  monto: number;

  @IsString()
  nombre_metodo: string;

  @IsInt()
  metodo_estado: number;

  @IsInt()
  @IsPositive()
  pedido_cantidad: number;

  @IsNumber()
  @IsPositive()
  pedido_precio: number;

  @IsInt()
  @IsPositive()
  id_metodo: number;

  @IsInt()
  estado: number;

  @IsInt()
  @IsPositive()
  total_rows: number;
}
