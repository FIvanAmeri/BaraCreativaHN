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
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import type { Express } from 'express';

import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { UpdateUsuarioDto } from '../../dto/crear-editar-usuarios/update-usuario.dto';
import { Usuario } from '../../entidades/usuario.entity';
import { UsuarioAutenticado } from '../../auth/decoradores/usuario-autenticado.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/guards/roles.guard';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';

@Controller('usuarios')
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@UsuarioAutenticado() usuario: Usuario) {
    return usuario;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(@Request() req: any): Promise<Usuario[]> {
    this.logger.log('findAll usuarios, rol: admin');
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string): Promise<Usuario | null> {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException('ID de usuario inválido.');
    }
    return this.usuariosService.findOne(idNum);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('foto', {
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Solo se permiten archivos de imagen (jpeg, png, gif).'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
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
      try {
        this.logger.log(`Subiendo foto de perfil para el usuario con ID: ${idNum}`);
        const fotoUrl = await this.cloudinaryService.uploadImage(foto);
        usuarioData.fotoPerfil = fotoUrl;
        this.logger.log(`Foto de perfil subida con éxito. URL: ${fotoUrl}`);
      } catch (error) {
        this.logger.error(`Error al subir la foto de perfil: ${error.message}`);
        throw new InternalServerErrorException('No se pudo subir la foto de perfil.');
      }
    }
    
    return this.usuariosService.update(idNum, usuarioData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException('ID de usuario inválido.');
    }
    await this.usuariosService.remove(idNum);
  }
}
