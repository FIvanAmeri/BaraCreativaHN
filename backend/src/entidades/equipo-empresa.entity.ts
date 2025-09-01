import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity'; 

export enum TipoMiembro {
  Admin = 'admin',
  Miembro = 'miembro',
}

@Entity('equipo_empresa')
export class EquipoEmpresaMiembro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.equiposEmpresaMiembros, { onDelete: 'CASCADE' })
  usuario: Usuario; 


  @ManyToOne(() => Curso, (curso) => curso.equiposEmpresa, { onDelete: 'CASCADE' })
  curso: Curso; 

  @Column({
    type: 'enum',
    enum: TipoMiembro,
    default: TipoMiembro.Miembro,
  })
  tipoMiembro: TipoMiembro;
}
