// src/sesion/sesion.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionService } from '../../services/sesion/sesion.service';
import { SesionController } from '../../controllers/sesion/sesion.controller';
import { Sesion } from '../../entidades/sesion.entity';
import { Usuario } from '../../entidades/usuario.entity'; // Asume esta ruta

@Module({
  imports: [
    TypeOrmModule.forFeature([Sesion, Usuario])
  ],
  controllers: [SesionController],
  providers: [SesionService],
  exports: [SesionService] // Para que otros módulos (como el de Auth) puedan usarlo
})
export class SesionModule {}