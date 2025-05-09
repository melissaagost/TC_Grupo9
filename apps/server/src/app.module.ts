import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsuarioModule } from './usuario/usuario.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MenuModule } from './menu/menu.module';
import { ItemModule } from './item/item.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { UsuarioController } from './usuario/usuario.controller';
import { MesaService } from './mesa/mesa.service';
import { MesaController } from './mesa/mesa.controller';
import { MesaModule } from './mesa/mesa.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client/dist'),
    }),
    UsuarioModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '..', '..', '.env'),
    }),
    RestaurantModule,
    MenuModule,
    ItemModule,
    CategoriesModule,
    MesaModule,
  ],
  controllers: [AppController, CategoriesController, UsuarioController, MesaController],
  providers: [AppService, MesaService],
})
export class AppModule {}
