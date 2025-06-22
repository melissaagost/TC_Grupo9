import {
  IsInt,
  IsArray,
  IsOptional,
  IsPositive,
  ValidateNested,
  ArrayMinSize,
  isNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class actualizarEstadoDTO {
  @IsInt()
  nuevo_estado: number;
}
