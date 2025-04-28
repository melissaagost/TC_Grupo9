import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRestaurant {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  direccion: string;

  @IsString()
  telefono: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  id_menu: number;
}
