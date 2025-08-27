import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Logger,
  UseInterceptors,
  UploadedFile,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';

import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { UpdateUsuarioDto } from '../../dto/crear-editar-usuarios/update-usuario.dto';
import { Usuario } from '../../entidades/usuario.entity';
import { UsuarioAutenticado } from '../../auth/decoradores/usuario-autenticado.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/guards/roles.guard';

@Controller('usuarios')
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@UsuarioAutenticado() usuario: Usuario): Promise<Partial<Usuario>> {
    this.logger.log(`Petición para el perfil de usuario recibida para: ${usuario.correoElectronico}`);
    if (!usuario || !usuario.id) {
        throw new ForbiddenException('No se pudo obtener la información del usuario.');
    }
  
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }


  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAll(@UsuarioAutenticado() usuario: Usuario): Promise<Usuario[]> {
    this.logger.log(`Usuario administrador (${usuario.correoElectronico}) ha accedido a la lista completa de usuarios.`);
    return this.usuariosService.findAll();
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async findAllAdmin(@Request() req): Promise<Usuario[]> {
    this.logger.log(`Acceso al endpoint de administración por el usuario: ${req.user.correoElectronico}`);
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Usuario> {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException(`ID inválido: ${id}`);
    }

    const usuario = await this.usuariosService.findOne(idNum);
    if (!usuario) {
      throw new BadRequestException(`Usuario con ID ${idNum} no encontrado`);
    }
    return usuario;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UsuarioAutenticado() usuarioAutenticado: Usuario,
    @Body() usuarioData: UpdateUsuarioDto,
    @UploadedFile() foto?: Express.Multer.File,
  ): Promise<Usuario> {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException(`ID inválido: ${id}`);
    }

    if (!usuarioAutenticado.esAdmin && usuarioAutenticado.id !== idNum) {
      throw new ForbiddenException('No tienes permiso para modificar este usuario');
    }

    if (!usuarioAutenticado.esAdmin) {
      if ('esAdmin' in usuarioData && usuarioData.esAdmin !== usuarioAutenticado.esAdmin) {
        throw new ForbiddenException('No puedes cambiar el permiso de administrador');
      }
      if ('tipoUsuario' in usuarioData && usuarioData.tipoUsuario === 'Admin') {
        throw new ForbiddenException('No puedes asignarte el rol Admin');
      }
    }

    if (foto) {
      usuarioData.fotoPerfil = foto.filename;
    }

    return this.usuariosService.update(idNum, usuarioData);
  }
}
