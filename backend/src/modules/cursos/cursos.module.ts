
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../../modules/cloudinary/cloudinary.module';
import { CursosController } from '../../controllers/cursos/cursos.controller';
import { CursosService } from '../../services/cursos/cursos.service';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity } from '../../entidades/modulo.entity';
import { Inscripcion } from '../../entidades/inscripcion.entity'; 
import { ProgresoModule } from '../progreso/progreso.module';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, ModuloEntity, Inscripcion]),
    ProgresoModule, 
    MailModule,
    CloudinaryModule, 
  ],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
