import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

export enum TipoConsulta {
  Tecnica = 'técnica',
  Administrativa = 'administrativa',
  Academica = 'académica',
}

export enum EstadoCaso {
  Pendiente = 'pendiente',
  EnRevision = 'en revisión',
  Cerrado = 'cerrado',
}

@Entity('contacto_soporte')
export class ContactoSoporte {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.contactoSoportes, { eager: true, onDelete: 'CASCADE' })
  usuario: Usuario;

  @CreateDateColumn()
  fechaMensaje: Date;

  @Column({
    type: 'enum',
    enum: TipoConsulta,
  })
  tipoConsulta: TipoConsulta;

  @Column('text')
  mensaje: string;

  @Column({
    type: 'enum',
    enum: EstadoCaso,
    default: EstadoCaso.Pendiente,
  })
  estadoCaso: EstadoCaso;
}
