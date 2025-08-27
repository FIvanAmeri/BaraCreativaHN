import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosController } from '../../controllers/cursos/cursos.controller';
import { CursosService } from '../../services/cursos/cursos.service';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity } from '../../entidades/modulo.entity';
import { Inscripcion } from '../../entidades/inscripcion.entity'; 
import { ProgresoModule } from '../../modules/progreso/progreso.module';
import { CloudinaryModule } from '../../modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, ModuloEntity, Inscripcion]),
    ProgresoModule,
    CloudinaryModule,
  ],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService], 
})
export class CursosModule {}
