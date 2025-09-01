import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('sesiones')
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.sesiones)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column()
  usuarioId: number;

  @CreateDateColumn({ type: 'timestamp' })
  fechaInicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaFin?: Date;

  @Column({ type: 'integer', default: 0 })
  duracionSegundos: number;
}