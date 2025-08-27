import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PasswordModule } from './modules/password/password.module';
import { AuthModule } from './modules/auth/auth.module';
import { CursosModule } from './modules/cursos/cursos.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { InscripcionesModule } from './modules/inscripciones/inscripciones.module';
import { ReporteProgresoModule } from './modules/reporte-progreso/reporte-progreso.module';
import { CertificadosModule } from './modules/certificados/certificados.module';
import { BadgesModule } from './modules/badges/badges.module';
import configuration, { AppConfig } from './config/configuration';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig>): TypeOrmModuleOptions => {
        const databaseUrl = process.env.DATABASE_URL;
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        }
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT ?? '5432', 10),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
          ssl: false,
        };
      },
    }),
    UsuariosModule,
    PasswordModule,
    AuthModule,
    CursosModule,
    PagosModule,
    InscripcionesModule,
    ReporteProgresoModule,
    CertificadosModule,
    BadgesModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
