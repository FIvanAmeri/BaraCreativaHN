import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Carrito } from './carrito.entity';
import { Certificado } from './certificado.entity';
import { ContactoSoporte } from './contacto-soporte.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
import { Inscripcion } from './inscripcion.entity';
import { Pago } from './pago.entity';
import { Resena } from './resena.entity';
import { Sesion } from './sesion.entity';

export enum TipoUsuario {
  Alumno = 'Alumno',
  Empresa = 'Empresa',
  Instructor = 'Instructor',
  Admin = 'Admin',
}

export enum EstadoCuenta {
  Activo = 'activo',
  Inactivo = 'inactivo',
  Bloqueado = 'bloqueado',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCompleto: string;

  @Column({ unique: true, name: 'correoelectronico' })
  correoElectronico: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.Alumno,
  })
  tipoUsuario: TipoUsuario;

  @Column({ nullable: true })
  nombreEmpresa?: string;

  @Column({
    type: 'enum',
    enum: EstadoCuenta,
    default: EstadoCuenta.Activo,
  })
  estadoCuenta: EstadoCuenta;

  @Column({
    type: 'boolean',
    default: false,
  })
  estaConectado: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  esAdmin: boolean;

  @Column({ type: 'timestamp', nullable: true })
  ultimaSesion?: Date;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @Column({ type: 'varchar', nullable: true })
  tokenRecuperacion: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expiracionTokenRecuperacion: Date | null;
  
  @Column({ type: 'varchar', nullable: true })
  tokenVerificacionCorreo: string | null;

  @Column({ type: 'boolean', default: false })
  correoConfirmado: boolean;

  @Column({ nullable: true })
  fotoPerfil?: string;

  @OneToMany(() => Carrito, (carrito) => carrito.usuario)
  carritos: Carrito[];

  @OneToMany(() => Certificado, (certificado) => certificado.usuario)
  certificados: Certificado[];

  @OneToMany(() => ContactoSoporte, (contacto) => contacto.usuario)
  contactoSoportes: ContactoSoporte[];

  @OneToMany(() => EquipoEmpresaMiembro, (equipoMiembro) => equipoMiembro.usuario)
  equiposEmpresaMiembros: EquipoEmpresaMiembro[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuario)
  inscripciones: Inscripcion[];

  @OneToMany(() => Pago, (pago) => pago.usuario)
  pagos: Pago[];

  @OneToMany(() => Resena, (resena) => resena.usuario)
  resenas: Resena[];

  @OneToMany(() => Sesion, (sesion) => sesion.usuario)
  sesiones: Sesion[];
}