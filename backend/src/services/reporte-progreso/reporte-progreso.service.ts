import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity, TipoModulo } from '../../entidades/modulo.entity';
import { Inscripcion } from '../../entidades/inscripcion.entity';
import { MarcarModuloCompletadoDto } from '../../interfaces/reporte-progreso.interface';
import { CertificadosService } from '../../services/certificados/certificados.service';

const SCORM_VIRTUAL_MODULE_ID_OFFSET = 1000000;

@Injectable()
export class ReporteProgresoService {
  private readonly logger = new Logger(ReporteProgresoService.name);

  constructor(
    @InjectRepository(ReporteProgresoEntity)
    private readonly reporteProgresoRepository: Repository<ReporteProgresoEntity>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(ModuloEntity)
    private readonly moduloRepository: Repository<ModuloEntity>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly certificadosService: CertificadosService,
  ) {}

  async marcarSCORMCompletado(usuarioId: number, cursoId: number): Promise<ReporteProgresoEntity> {
    this.logger.log(`[marcarSCORMCompletado] Iniciando para Usuario ID: ${usuarioId}, Curso ID: ${cursoId}`);

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      this.logger.warn(`[marcarSCORMCompletado] Usuario ${usuarioId} no encontrado.`);
      throw new NotFoundException('Usuario no encontrado');
    }

    const curso = await this.cursoRepository.findOne({ where: { id: cursoId } });
    if (!curso) {
      this.logger.warn(`[marcarSCORMCompletado] Curso ${cursoId} no encontrado.`);
      throw new NotFoundException('Curso no encontrado');
    }

    const scormVirtualModuloId = cursoId + SCORM_VIRTUAL_MODULE_ID_OFFSET;

    let scormModuloEnBD: ModuloEntity | null;
    try {
      scormModuloEnBD = await this.moduloRepository.findOne({
        where: { id: scormVirtualModuloId }
      });
      this.logger.log(`[marcarSCORMCompletado] Búsqueda de Modulo SCORM virtual (ID: ${scormVirtualModuloId}): ${scormModuloEnBD ? 'Encontrado' : 'No encontrado'}.`);

      if (!scormModuloEnBD) {
        this.logger.log(`[marcarSCORMCompletado] Creando nuevo Modulo SCORM virtual (ID: ${scormVirtualModuloId}) en la base de datos.`);
        const nuevoScormModulo = this.moduloRepository.create({
          id: scormVirtualModuloId,
          titulo: curso.titulo + ' (Módulo SCORM Principal)',
          tipo: TipoModulo.SCORM,
          curso: curso,
          orden: 0
        });
        scormModuloEnBD = await this.moduloRepository.save(nuevoScormModulo);
        this.logger.log(`[marcarSCORMCompletado] Modulo SCORM virtual (ID: ${scormVirtualModuloId}) GUARDADO exitosamente en la tabla 'modulos'.`);
      }
    } catch (error) {
      this.logger.error(`[marcarSCORMCompletado] ERROR CRÍTICO al buscar/crear Modulo SCORM virtual (ID: ${scormVirtualModuloId}): ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al asegurar la existencia del módulo SCORM virtual.');
    }

    let reporteProgreso: ReporteProgresoEntity | null;
    try {
      reporteProgreso = await this.reporteProgresoRepository.findOne({
        where: { usuario: { id: usuarioId }, modulo: { id: scormVirtualModuloId }, curso: { id: cursoId } },
      });
      this.logger.log(`[marcarSCORMCompletado] Búsqueda de ReporteProgreso existente para Modulo SCORM virtual: ${reporteProgreso ? 'Encontrado' : 'No encontrado'}.`);

      if (reporteProgreso && reporteProgreso.completado) {
        this.logger.log(`[marcarSCORMCompletado] Módulo SCORM virtual del curso ${cursoId} ya estaba completado para usuario ${usuarioId}.`);
        return reporteProgreso;
      }

      if (!reporteProgreso) {
        this.logger.log(`[marcarSCORMCompletado] Creando nuevo ReporteProgreso para módulo SCORM virtual (ID: ${scormVirtualModuloId}).`);
        reporteProgreso = this.reporteProgresoRepository.create({
          usuario,
          curso,
          modulo: scormModuloEnBD,
        });
      }

      reporteProgreso.completado = true;
      reporteProgreso.fechaCompletado = new Date();

      const reporteGuardado = await this.reporteProgresoRepository.save(reporteProgreso);
      this.logger.log(`[marcarSCORMCompletado] ReporteProgreso para Modulo SCORM virtual (ID: ${scormVirtualModuloId}) GUARDADO exitosamente en la tabla 'reportes_progreso'.`);

      await this.verificarYMarcarCursoCompleto(usuarioId, cursoId, scormModuloEnBD);

      return reporteGuardado;

    } catch (error) {
      this.logger.error(`[marcarSCORMCompletado] ERROR CRÍTICO al guardar ReporteProgreso para Modulo SCORM virtual (ID: ${scormVirtualModuloId}): ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al guardar el progreso del módulo SCORM.');
    }
  }

  async marcarModuloCompletado(
    usuarioId: number,
    dto: MarcarModuloCompletadoDto,
  ): Promise<ReporteProgresoEntity> {
    const { cursoId, moduloId } = dto;

    this.logger.log(`[marcarModuloCompletado] Intentando marcar módulo ${moduloId} del curso ${cursoId} como completado para usuario ${usuarioId}`);

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      this.logger.warn(`[marcarModuloCompletado] Usuario ${usuarioId} no encontrado.`);
      throw new NotFoundException('Usuario no encontrado');
    }

    const curso = await this.cursoRepository.findOne({ where: { id: cursoId } });
    if (!curso) {
      this.logger.warn(`[marcarModuloCompletado] Curso ${cursoId} no encontrado.`);
      throw new NotFoundException('Curso no encontrado');
    }

    if (moduloId >= SCORM_VIRTUAL_MODULE_ID_OFFSET) {
      throw new BadRequestException('Intento de marcar un módulo virtual SCORM con el método incorrecto.');
    }

    const modulo = await this.moduloRepository.findOne({ where: { id: moduloId, curso: { id: cursoId } } });
    if (!modulo) {
      this.logger.warn(`[marcarModuloCompletado] Módulo ${moduloId} no encontrado en el curso ${cursoId}.`);
      throw new NotFoundException('Módulo no encontrado en este curso');
    }

    let reporteProgreso = await this.reporteProgresoRepository.findOne({
      where: { usuario: { id: usuarioId }, modulo: { id: moduloId }, curso: { id: cursoId } },
    });

    if (reporteProgreso && reporteProgreso.completado) {
      this.logger.log(`[marcarModuloCompletado] Módulo ${moduloId} del curso ${cursoId} ya estaba completado para usuario ${usuarioId}.`);
      return reporteProgreso;
    }

    if (!reporteProgreso) {
      this.logger.log(`[marcarModuloCompletado] Creando nuevo reporte de progreso para módulo ${moduloId}.`);
      reporteProgreso = this.reporteProgresoRepository.create({
        usuario,
        curso,
        modulo,
      });
    }

    reporteProgreso.completado = true;
    reporteProgreso.fechaCompletado = new Date();

    const reporteGuardado = await this.reporteProgresoRepository.save(reporteProgreso);
    this.logger.log(`[marcarModuloCompletado] Módulo ${moduloId} del curso ${cursoId} marcado como completado para usuario ${usuarioId}.`);

    await this.verificarYMarcarCursoCompleto(usuarioId, cursoId, modulo);

    return reporteGuardado;
  }

  async obtenerProgresoModulosUsuario(usuarioId: number, cursoId: number): Promise<ReporteProgresoEntity[]> {
    this.logger.log(`[obtenerProgresoModulosUsuario] Obteniendo progreso de módulos para usuario ${usuarioId} en curso ${cursoId}.`);
    const progreso = await this.reporteProgresoRepository.find({
      where: [
        { usuario: { id: usuarioId }, curso: { id: cursoId }, modulo: { id: Not(cursoId + SCORM_VIRTUAL_MODULE_ID_OFFSET) } },
        { usuario: { id: usuarioId }, curso: { id: cursoId }, modulo: { id: cursoId + SCORM_VIRTUAL_MODULE_ID_OFFSET } }
      ],
      relations: ['modulo'],
    });
    this.logger.log(`[obtenerProgresoModulosUsuario] Progreso encontrado: ${progreso.map(p => `ModuloID:${p.modulo.id} Completado:${p.completado}`).join(', ')}`);
    return progreso;
  }

  private async verificarYMarcarCursoCompleto(usuarioId: number, cursoId: number, moduloRecienCompletado?: ModuloEntity): Promise<void> {
    this.logger.log(`[verificarYMarcarCursoCompleto] Iniciando para usuario ${usuarioId} y curso ${cursoId}.`);

    const curso = await this.cursoRepository.findOne({
      where: { id: cursoId },
      relations: ['modulos'],
    });

    if (!curso) {
      this.logger.warn(`[verificarYMarcarCursoCompleto] No se pudo verificar el curso ${cursoId} para marcar como completo: curso no encontrado.`);
      return;
    }

    let modulosDelCursoParaComprobacion: ModuloEntity[] = [];

    // Lógica para manejar el módulo SCORM virtual
    if (curso.archivoScorm) {
      const scormVirtualModuloId = cursoId + SCORM_VIRTUAL_MODULE_ID_OFFSET;
      const scormModuloReal = await this.moduloRepository.findOne({ where: { id: scormVirtualModuloId } });

      if (scormModuloReal) {
        modulosDelCursoParaComprobacion.push(scormModuloReal);
        this.logger.log(`[verificarYMarcarCursoCompleto] Agregado módulo SCORM virtual (ID: ${scormVirtualModuloId}) REAL de la BD a la lista de comprobación.`);
      } else {
        const scormModuloProxy = new ModuloEntity();
        scormModuloProxy.id = scormVirtualModuloId;
        scormModuloProxy.titulo = curso.titulo + ' (Módulo SCORM Principal)';
        scormModuloProxy.tipo = TipoModulo.SCORM;
        scormModuloProxy.orden = 0;
        modulosDelCursoParaComprobacion.push(scormModuloProxy);
        this.logger.log(`[verificarYMarcarCursoCompleto] Agregado módulo SCORM virtual (ID: ${scormVirtualModuloId}) como PROXY a la lista de comprobación (no encontrado en BD).`);
      }
    }

    // Filtra los módulos regulares para no incluir otros SCORM
    const modulosRegulares = curso.modulos.filter(m => m.tipo !== TipoModulo.SCORM);
    modulosDelCursoParaComprobacion = [
      ...modulosDelCursoParaComprobacion,
      ...modulosRegulares
    ];

    this.logger.log(`[verificarYMarcarCursoCompleto] Módulos esperados FINALES para el curso ${cursoId}: ${modulosDelCursoParaComprobacion.map(m => `ID:${m.id} Tipo:${m.tipo}`).join(', ')}`);

    if (modulosDelCursoParaComprobacion.length === 0) {
      this.logger.log(`[verificarYMarcarCursoCompleto] Curso ${cursoId} no tiene módulos para verificar el progreso, no se puede marcar como completo.`);
      return;
    }

    const progresoUsuario = await this.reporteProgresoRepository.find({
      where: { usuario: { id: usuarioId }, curso: { id: cursoId }, completado: true },
      relations: ['modulo'],
      cache: false,
    });

    const modulosCompletadosIds = new Set(progresoUsuario.map(rp => rp.modulo.id));
    this.logger.log(`[verificarYMarcarCursoCompleto] Módulos completados registrados para usuario ${usuarioId} en curso ${cursoId}: [${Array.from(modulosCompletadosIds).join(', ')}]`);

    const todosLosModulosCompletados = modulosDelCursoParaComprobacion.every(modulo =>
      modulosCompletadosIds.has(modulo.id)
    );
    this.logger.log(`[verificarYMarcarCursoCompleto] Resultado de la comprobación 'todosLosModulosCompletados': ${todosLosModulosCompletados}`);

    if (todosLosModulosCompletados) {
      this.logger.log(`[verificarYMarcarCursoCompleto] Todos los módulos del curso ${cursoId} completados por usuario ${usuarioId}. Marcando curso como completado.`);

      const inscripcion = await this.inscripcionRepository.findOne({
        where: { usuario: { id: usuarioId }, curso: { id: cursoId } },
      });

      if (inscripcion && !inscripcion.cursoCompletado) {
        inscripcion.cursoCompletado = true;
        inscripcion.estado = 'Completado';
        inscripcion.fechaFinalizacion = new Date();
        await this.inscripcionRepository.save(inscripcion);
        this.logger.log(`[verificarYMarcarCursoCompleto] Inscripción ${inscripcion.id} marcada como completada para usuario ${usuarioId} y curso ${cursoId}.`);

        try {
          await this.certificadosService.generarCertificado(usuarioId, cursoId);
          this.logger.log(`[verificarYMarcarCursoCompleto] Certificado generado automáticamente para usuario ${usuarioId} y curso ${cursoId}.`);
        } catch (error) {
          this.logger.error(`[verificarYMarcarCursoCompleto] Error al generar certificado automáticamente para usuario ${usuarioId} y curso ${cursoId}: ${error.message}`);
        }
      } else if (inscripcion && inscripcion.cursoCompletado) {
        this.logger.log(`[verificarYMarcarCursoCompleto] Curso ${cursoId} ya estaba marcado como completado para usuario ${usuarioId}.`);
      } else {
        this.logger.warn(`[verificarYMarcarCursoCompleto] No se encontró inscripción para usuario ${usuarioId} y curso ${cursoId} al intentar marcar como completado.`);
      }
    } else {
      this.logger.log(`[verificarYMarcarCursoCompleto] Curso ${cursoId} NO está completamente completado. Faltan módulos.`);
    }
  }
}