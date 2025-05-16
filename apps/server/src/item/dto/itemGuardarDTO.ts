import {
  IsInt,
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  MaxLength,
} from 'class-validator';

export class ItemGuardarDTO {
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_item?: number;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @MaxLength(255)
  descripcion: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsInt()
  @Min(0)
  estado: number;

  @IsInt()
  @IsPositive()
  id_categoria: number;

  @IsInt()
  @IsPositive()
  id_menu: number;
}
