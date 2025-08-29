import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Curso } from './curso.entity';

export enum TipoModulo {
  SCORM = 'scorm',
  VIDEO = 'video',
  PDF = 'pdf',
  IMAGEN = 'imagen',
  TEXTO = 'texto',
}

@Entity('modulos')
export class ModuloEntity extends BaseEntity {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column('simple-array', { nullable: true })
  videoUrl?: string[] | null;

  @Column('simple-array', { nullable: true })
  pdfUrl?: string[] | null;

  @Column('simple-array', { nullable: true })
  imageUrl?: string[] | null;

  @Column({ type: 'int', nullable: true })
  orden: number | null;

  @Column({ type: 'enum', enum: TipoModulo, default: TipoModulo.TEXTO })
  tipo: TipoModulo;

  @ManyToOne(() => Curso, (curso) => curso.modulos, { onDelete: 'CASCADE' })
  curso: Curso;
}
