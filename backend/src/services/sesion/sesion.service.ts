// src/services/sesion/sesion.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sesion } from '../../entidades/sesion.entity';

@Injectable()
export class SesionService {
  constructor(
    @InjectRepository(Sesion)
    private sesionRepository: Repository<Sesion>,
  ) {}

  async crearSesion(usuarioId: number): Promise<Sesion> {
    const sesion = this.sesionRepository.create({ usuarioId, fechaInicio: new Date() });
    return this.sesionRepository.save(sesion);
  }

  async finalizarSesion(sesionId: number): Promise<void> {
    const sesion = await this.sesionRepository.findOne({ where: { id: sesionId } });
    if (sesion) {
      const fechaFin = new Date();
      const duracionSegundos = Math.floor((fechaFin.getTime() - sesion.fechaInicio.getTime()) / 1000);
      await this.sesionRepository.update(sesionId, { fechaFin, duracionSegundos });
    }
  }

  async obtenerUltimaSesion(usuarioId: number): Promise<Sesion | null> {
    return this.sesionRepository.findOne({
      where: { usuarioId },
      order: { fechaInicio: 'DESC' },
    });
  }

  async obtenerDuracionTotal(usuarioId: number): Promise<number> {
    const sesiones = await this.sesionRepository.find({ where: { usuarioId } });
    const duracionTotal = sesiones.reduce((total, sesion) => total + sesion.duracionSegundos, 0);
    return duracionTotal;
  }
  
  async obtenerSesionesFiltradas(filtros: { nombre?: string; correo?: string }): Promise<Sesion[]> {
    const query = this.sesionRepository
      .createQueryBuilder('sesion')
      .leftJoinAndSelect('sesion.usuario', 'usuario');

    if (filtros.nombre) {
      query.andWhere('LOWER(usuario.nombreCompleto) LIKE LOWER(:nombre)', { nombre: `%${filtros.nombre}%` });
    }

    if (filtros.correo) {
      query.andWhere('LOWER(usuario.correoElectronico) LIKE LOWER(:correo)', { correo: `%${filtros.correo}%` });
    }

    query.orderBy('sesion.fechaInicio', 'DESC');

    return query.getMany();
  }
}