import {
  IsInt,
  IsArray,
  IsOptional,
  IsPositive,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDTO {
  @IsInt()
  @IsPositive()
  id_item: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}

export class PedidoCompletoGuardarDTO {
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_pedido?: number;

  @IsInt()
  @IsPositive()
  id_usuario: number;

  @IsInt()
  @IsPositive()
  id_mesa: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDTO)
  items: ItemPedidoDTO[];
}
