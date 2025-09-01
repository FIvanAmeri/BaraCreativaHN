// src/controllers/sesion/sesion.controller.ts
import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { SesionService } from '../../services/sesion/sesion.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decoradores/public.decorator';
import { Sesion } from '../../entidades/sesion.entity';

@UseGuards(JwtAuthGuard)
@Controller('sesion')
export class SesionController {
  constructor(private readonly sesionService: SesionService) {}

  @Public()
  @Get('ultima')
  async obtenerUltimaSesion(@Query('usuarioId') usuarioId: string): Promise<Sesion | null> {
    const id = parseInt(usuarioId, 10);
    return this.sesionService.obtenerUltimaSesion(id);
  }

  @Public()
  @Get('duracion-total')
  async obtenerDuracionTotal(@Query('usuarioId') usuarioId: string): Promise<{ duracion: number }> {
    const id = parseInt(usuarioId, 10);
    const duracion = await this.sesionService.obtenerDuracionTotal(id);
    return { duracion };
  }
}