import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SesionService } from '../../services/sesion/sesion.service';
import { Sesion } from '../../entidades/sesion.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsuarioAutenticado } from '../../auth/decoradores/usuario-autenticado.decorator';
import { Usuario } from '../../entidades/usuario.entity';

@UseGuards(JwtAuthGuard)
@Controller('sesion')
export class SesionController {
  constructor(private readonly sesionService: SesionService) {}

  @Get('ultima')
  async obtenerUltimaSesion(@UsuarioAutenticado() usuario: Usuario): Promise<Sesion | null> {
    return this.sesionService.obtenerUltimaSesion(usuario.id);
  }

  @Get('duracion-total')
  async obtenerDuracionTotal(@UsuarioAutenticado() usuario: Usuario): Promise<{ duracion: number }> {
    const duracion = await this.sesionService.obtenerDuracionTotal(usuario.id);
    return { duracion };
  }
}