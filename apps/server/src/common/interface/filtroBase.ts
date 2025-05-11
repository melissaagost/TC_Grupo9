import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class FiltroBase {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estado?: number;

  @IsOptional()
  @IsString()
  ordenCol?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  ordenDir?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageIndex?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}
