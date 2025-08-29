import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity, TipoModulo } from '../../entidades/modulo.entity';
import { Repository, DeepPartial } from 'typeorm';
import { CrearCursoDto } from '../../dto/cursos/crear-curso.dto';
import { join } from 'path';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import { v4 as uuidv4 } from 'uuid';
import { Inscripcion } from '../../entidades/inscripcion.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursosRepository: Repository<Curso>,
    @InjectRepository(ModuloEntity)
    private readonly modulosRepository: Repository<ModuloEntity>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionesRepository: Repository<Inscripcion>,
  ) {}

  obtenerCursos(): Promise<Curso[]> {
    return this.cursosRepository.find({ relations: ['modulos'] });
  }

  obtenerCursosDisponibles(): Promise<Curso[]> {
    return this.cursosRepository
      .createQueryBuilder('curso')
      .leftJoinAndSelect('curso.modulos', 'modulos')
      .where('curso.fechaInicio <= NOW()')
      .getMany();
  }

  async obtenerCursoPorId(id: number): Promise<Curso> {
    const curso = await this.cursosRepository.findOne({
      where: { id },
      relations: ['modulos'],
    });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  crearCurso(datos: CrearCursoDto): Promise<Curso> {
    const nuevoCurso = this.cursosRepository.create(datos as DeepPartial<Curso>);
    return this.cursosRepository.save(nuevoCurso);
  }

  async actualizarCurso(
    id: number,
    datos: Partial<CrearCursoDto>,
  ): Promise<Curso> {
    const curso = await this.obtenerCursoPorId(id);

    if (datos.modulos !== undefined) {
    }

    Object.assign(curso, datos);

    return this.cursosRepository.save(curso);
  }

  async eliminarCurso(id: number): Promise<void> {
    const result = await this.cursosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
  }

  async actualizarArchivoScorm(
    id: number,
    scormFile: Express.Multer.File,
  ): Promise<Curso> {
    const curso = await this.obtenerCursoPorId(id);

    const scormZipPath = scormFile.path;
    const uniqueFolderName = uuidv4();
    const destinationPath = join(
      process.cwd(),
      'uploads',
      'scorm_unzipped_courses',
      uniqueFolderName,
    );

    try {
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      const zip = new AdmZip(scormZipPath);
      const imsManifestEntry = zip.getEntry('imsmanifest.xml');

      if (!imsManifestEntry) {
        fs.unlinkSync(scormZipPath);
        throw new BadRequestException(
          'El archivo ZIP no es un paquete SCORM válido (falta imsmanifest.xml).',
        );
      }

      zip.extractAllTo(destinationPath, true);

      const imsManifestContent = imsManifestEntry.getData().toString('utf8');

      let scormEntryPoint = '';

      const resourceHrefMatch = imsManifestContent.match(
        /<resource[^>]*href="([^"]+)"[^>]*>/,
      );

      if (resourceHrefMatch && resourceHrefMatch[1]) {
        scormEntryPoint = resourceHrefMatch[1];
        const queryParamIndex = scormEntryPoint.indexOf('?');
        if (queryParamIndex !== -1) {
          scormEntryPoint = scormEntryPoint.substring(0, queryParamIndex);
        }
        if (scormEntryPoint.startsWith('/')) {
          scormEntryPoint = scormEntryPoint.slice(1);
        }
      } else if (fs.existsSync(join(destinationPath, 'index.html'))) {
        scormEntryPoint = 'index.html';
      } else if (fs.existsSync(join(destinationPath, 'proxy.html'))) {
        scormEntryPoint = 'proxy.html';
      } else {
        throw new BadRequestException(
          'No se pudo determinar el punto de entrada del SCORM (ni en manifest, ni index.html, ni proxy.html).',
        );
      }

      const entryFilePath = join(destinationPath, scormEntryPoint);
      if (!fs.existsSync(entryFilePath)) {
        throw new InternalServerErrorException(`El archivo de entrada SCORM (${scormEntryPoint}) no se encontró después de la extracción.`);
      }

      if (curso.archivoScorm) {
        const prevParts = curso.archivoScorm.split('/');
        const prevFolder = prevParts.length > 1 ? prevParts[1] : null;
        if (prevFolder) {
          const prevFullPath = join(
            process.cwd(),
            'uploads',
            'scorm_unzipped_courses',
            prevFolder,
          );
          if (fs.existsSync(prevFullPath)) {
            fs.rmSync(prevFullPath, { recursive: true, force: true });
          }
        }
      }

      const scormDbPath = `/${uniqueFolderName}/${scormEntryPoint}`;

      curso.archivoScorm = scormDbPath;
      await this.cursosRepository.save(curso);

      fs.unlinkSync(scormZipPath);

      return curso;
    } catch (error) {
      if (fs.existsSync(scormZipPath)) {
        fs.unlinkSync(scormZipPath);
      }

      if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
      }

      if (error instanceof BadRequestException || error instanceof InternalServerErrorException || error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof Error) {
        throw new InternalServerErrorException(`Error inesperado al procesar SCORM: ${error.message}`);
      } else {
        throw new InternalServerErrorException('Error inesperado y desconocido al procesar SCORM.');
      }
    }
  }

  async actualizarModuloFilePaths(
    moduloId: number,
    updatedPaths: { videoUrls?: string[]; pdfUrls?: string[]; imageUrls?: string[] },
  ): Promise<ModuloEntity> {
    const modulo = await this.modulosRepository.findOneBy({ id: moduloId });
    if (!modulo) {
      throw new NotFoundException(`Módulo con ID ${moduloId} no encontrado`);
    }

    modulo.videoUrl = modulo.videoUrl || [];
    modulo.pdfUrl = modulo.pdfUrl || [];
    modulo.imageUrl = modulo.imageUrl || [];

    if (updatedPaths.videoUrls && updatedPaths.videoUrls.length > 0) {
      updatedPaths.videoUrls.forEach(url => {
        if (!modulo.videoUrl!.includes(url)) {
          modulo.videoUrl!.push(url);
        }
      });
      modulo.tipo = TipoModulo.VIDEO;
    }
    if (updatedPaths.pdfUrls && updatedPaths.pdfUrls.length > 0) {
      updatedPaths.pdfUrls.forEach(url => {
        if (!modulo.pdfUrl!.includes(url)) {
          modulo.pdfUrl!.push(url);
        }
      });
      modulo.tipo = TipoModulo.PDF;
    }
    if (updatedPaths.imageUrls && updatedPaths.imageUrls.length > 0) {
      updatedPaths.imageUrls.forEach(url => {
        if (!modulo.imageUrl!.includes(url)) {
          modulo.imageUrl!.push(url);
        }
      });
      modulo.tipo = TipoModulo.IMAGEN;
    }

    const savedModulo = await this.modulosRepository.save(modulo);
    return savedModulo;
  }

  async actualizarModuloTexto(moduloId: number, texto: string): Promise<ModuloEntity> {
    const modulo = await this.modulosRepository.findOneBy({ id: moduloId });
    if (!modulo) {
      throw new NotFoundException(`Módulo con ID ${moduloId} no encontrado`);
    }

    modulo.descripcion = texto;
    modulo.tipo = TipoModulo.TEXTO;

    const savedModulo = await this.modulosRepository.save(modulo);
    return savedModulo;
  }

  async obtenerCursosDeUsuario(userId: number): Promise<Curso[]> {
    const inscripciones = await this.inscripcionesRepository
      .createQueryBuilder("inscripcion")
      .leftJoinAndSelect("inscripcion.curso", "curso")
      .where("inscripcion.usuario.id = :userId", { userId })
      .getMany();

    if (!inscripciones || inscripciones.length === 0) {
      return [];
    }

    return inscripciones.map(inscripcion => inscripcion.curso);
  }
}
