import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ModuloEntity } from './modulo.entity';
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

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Título del Curso' })
  titulo: string;

  @Column({ default: 'Descripción del curso por defecto' })
  descripcion: string;

  @Column({ type: 'enum', enum: ClaseItem, default: ClaseItem.CURSO })
  claseItem: ClaseItem;

  @Column({ default: 'Docentes' })
  tipo: 'Docentes' | 'Empresas';

  @Column({ default: 'General' })
  categoria: string;

  @Column({ type: 'int', default: 0 })
  duracionHoras: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  precio: number;

  @Column({ default: 'grabado' })
  modalidad: 'en vivo' | 'grabado' | 'mixto';

  @Column({ default: false })
  certificadoDisponible: boolean;

  @Column({ default: false })
  badgeDisponible: boolean;

  @Column({ nullable: true })
  imagenCurso?: string;

  @Column({ nullable: true })
  archivoScorm?: string;

  @Column({ nullable: true })
  videoCurso?: string;

  @Column({ nullable: true })
  pdfCurso?: string;

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
  equiposAsignados: EquipoEmpresaMiembro[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.curso)
  inscripciones: Inscripcion[];

  @OneToMany(() => Pago, (pago) => pago.curso)
  pagos: Pago[];

  @OneToMany(() => ReporteProgresoEntity, (reporte) => reporte.curso)
  reportesProgreso: ReporteProgresoEntity[];

  @OneToMany(() => Resena, (resena) => resena.curso)
  resenas: Resena[];
}