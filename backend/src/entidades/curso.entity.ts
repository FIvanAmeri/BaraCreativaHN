import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { BadgeEntity } from './badge.entity';
import { Carrito } from './carrito.entity';
import { Certificado } from './certificado.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
import { Inscripcion } from './inscripcion.entity';
import { Pago } from './pago.entity';
import { ReporteProgresoEntity } from './ReporteProgreso.entity';
import { Resena } from './resena.entity';

export enum ClaseItem {
  CURSO = 'curso',
  SERVICIO = 'servicio',
}

export enum TipoCurso {
  DOCENTES = 'Docentes',
  ESTUDIANTES = 'Estudiantes',
  EMPRESAS = 'Empresas',
}

export enum ModalidadCurso {
  EN_VIVO = 'en vivo',
  GRABADO = 'grabado',
  MIXTO = 'mixto',
}

export enum ContenidoTipo {
  TEXTO = 'texto',
  VIDEO = 'video',
  PDF = 'pdf',
  IMAGEN = 'imagen',
}

export interface ContenidoItem {
  tipo: ContenidoTipo;
  valor: string;
}

@Entity('modulos')
export class ModuloEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'jsonb', nullable: true })
  contenido: ContenidoItem[];

  @Column({ type: 'int', nullable: true })
  orden: number;

  @ManyToOne(() => Curso, (curso) => curso.modulos)
  curso: Curso;

  @OneToMany(() => ReporteProgresoEntity, (progreso) => progreso.modulo)
  reportesProgreso: ReporteProgresoEntity[];
}

@Entity('cursos')
export class Curso extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Título del Curso' })
  titulo: string;

  @Column({ default: 'Descripción del curso por defecto' })
  descripcion: string;

  @Column({ type: 'enum', enum: ClaseItem, default: ClaseItem.CURSO })
  claseItem: ClaseItem;

  @Column({ type: 'enum', enum: TipoCurso, default: TipoCurso.DOCENTES })
  tipo: TipoCurso;

  @Column({ default: 'General' })
  categoria: string;

  @Column({ nullable: true })
  subcategoria?: string;

  @Column({ type: 'int', default: 0 })
  duracionHoras: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  precio: number;

  @Column({ type: 'enum', enum: ModalidadCurso, default: ModalidadCurso.GRABADO })
  modalidad: ModalidadCurso;

  @Column({ default: false })
  certificadoDisponible: boolean;

  @Column({ default: false })
  badgeDisponible: boolean;

  @Column({ nullable: true })
  imagenCurso?: string;

  @Column({ nullable: true })
  archivoScorm?: string;

  @Column({ type: 'date', nullable: true })
  fechaInicio?: Date;

  @OneToMany(() => ModuloEntity, (modulo) => modulo.curso, { cascade: true, eager: true })
  modulos: ModuloEntity[];

  @OneToMany(() => BadgeEntity, (badge) => badge.curso)
  badges: BadgeEntity[];

  @OneToMany(() => Carrito, (carrito) => carrito.curso)
  carritos: Carrito[];

  @OneToMany(() => Certificado, (certificado) => certificado.curso)
  certificados: Certificado[];

  @OneToMany(() => EquipoEmpresaMiembro, (equipo) => equipo.curso)
  equiposEmpresa: EquipoEmpresaMiembro[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.curso)
  inscripciones: Inscripcion[];

  @OneToMany(() => Pago, (pago) => pago.curso)
  pagos: Pago[];

  @OneToMany(() => ReporteProgresoEntity, (reporte) => reporte.curso)
  reportesProgreso: ReporteProgresoEntity[];

  @OneToMany(() => Resena, (resena) => resena.curso)
  resenas: Resena[];
}
