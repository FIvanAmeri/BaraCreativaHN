import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Usuario, TipoUsuario } from '../../entidades/usuario.entity';
import { Sesion } from '../../entidades/sesion.entity';
import * as bcrypt from 'bcrypt';
import { SocketGateway } from '../../socket/socket.gateway';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway,
  ) {}

  async encontrarPorId(id: number): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({ where: { id } });
  }

  async encontrarPorCorreo(correoElectronico: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({ where: { correoElectronico } });
  }

  async findAll(nombre?: string, correoElectronico?: string): Promise<Usuario[]> {
    const where: FindOptionsWhere<Usuario>[] = [];
    if (nombre) {
      where.push({ nombreCompleto: Like(`%${nombre}%`) });
    }
    if (correoElectronico) {
      where.push({ correoElectronico: Like(`%${correoElectronico}%`) });
    }
    const queryOptions = where.length > 0 ? { where: where } : {};

    return this.usuariosRepository.find({
      ...queryOptions,
      select: {
        id: true,
        nombreCompleto: true,
        correoElectronico: true,
        tipoUsuario: true,
        nombreEmpresa: true,
        estadoCuenta: true,
        estaConectado: true,
        esAdmin: true,
        ultimaSesion: true,
        fotoPerfil: true, 
      },
      order: {
        id: 'ASC'
      }
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return usuario;
  }

  async create(usuarioData: Partial<Usuario>): Promise<Usuario> {
    if (usuarioData.password) {
      const salt = await bcrypt.genSalt();
      usuarioData.password = await bcrypt.hash(usuarioData.password, salt);
    }
    const nuevoUsuario = this.usuariosRepository.create(usuarioData);
    return this.usuariosRepository.save(nuevoUsuario);
  }

  async update(id: number, usuarioData: Partial<Usuario>): Promise<Usuario> {
    const usuarioExistente = await this.encontrarPorId(id);
    if (!usuarioExistente) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    if (usuarioData.password) {
      const salt = await bcrypt.genSalt();
      usuarioData.password = await bcrypt.hash(usuarioData.password, salt);
    }

    if (usuarioData.tipoUsuario) {
      usuarioData.esAdmin = usuarioData.tipoUsuario === TipoUsuario.Admin;
    }

    await this.usuariosRepository.update(id, usuarioData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.usuariosRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
  }

  async actualizarEstado(id: number, conectado: boolean): Promise<void> {
    const resultado = await this.usuariosRepository.update(id, { estaConectado: conectado });
    if (resultado.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado para actualizar estado.`);
    }
  }

  async encontrarConPagosPorCorreo(correoElectronico: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({
      where: { correoElectronico },
      relations: ['pagos', 'pagos.curso'],
    });
  }

  async actualizarUltimaSesion(id: number, fecha: Date): Promise<void> {
    await this.usuariosRepository.update(id, { ultimaSesion: fecha });
  }

  async notificarActualizacionEstado(): Promise<void> {
    const usuarios = await this.findAll();
    this.socketGateway.server.emit('usuariosActualizados', usuarios);
  }

  async obtenerUsuariosConDatosSesion(
    nombreFiltro?: string,
    correoFiltro?: string,
  ): Promise<(Usuario & { duracionUltimaSesion?: number; duracionTotalConectado?: number })[]> {
    let query = this.usuariosRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.sesiones', 'sesion');

    if (nombreFiltro) {
      query = query.andWhere('LOWER(usuario.nombreCompleto) LIKE LOWER(:nombre)', {
        nombre: `%${nombreFiltro}%`,
      });
    }

    if (correoFiltro) {
      query = query.andWhere('LOWER(usuario.correoElectronico) LIKE LOWER(:correo)', {
        correo: `%${correoFiltro}%`,
      });
    }

    const usuarios = await query.getMany();

    return usuarios.map((usuario) => {
      const sesionesFinalizadas = usuario.sesiones.filter((s) => s.fechaFin);
      const ultimaSesion = sesionesFinalizadas.sort(
        (a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime(),
      )[0];
      const duracionTotalConectado = usuario.sesiones.reduce(
        (total, sesion) => total + (sesion.duracionSegundos || 0),
        0,
      );
      return {
        ...usuario,
        duracionUltimaSesion: ultimaSesion ? ultimaSesion.duracionSegundos : undefined,
        duracionTotalConectado,
      };
    });
  }
}
