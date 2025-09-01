// src/controllers/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Usuario } from '../../entidades/usuario.entity';
import { SocketGateway } from '../../socket/socket.gateway';
import { SolicitarResetDto } from '../../dto/password/solicitar-reset.dto';
import { ResetPasswordDto } from '../../dto/password/reset-password.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUsuarioDto } from '../../dto/crear-editar-usuarios/create-usuario.dto';
import { SesionService } from '../../services/sesion/sesion.service'; // Asegúrate de importar SesionService

interface UserRequest extends Request {
  user: Usuario;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService,
    private readonly socketGateway: SocketGateway,
    private readonly sesionService: SesionService, // <--- Agregamos SesionService
  ) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async registro(@Body() datos: CreateUsuarioDto) {
    await this.authService.registrarUsuario(datos);
    return {
      message: 'Registro exitoso. Por favor, valida tu correo electrónico para activar tu cuenta.',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() datos: { correoElectronico: string, password: string }, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(datos.correoElectronico, datos.password);
    const token = user.access_token;
    res.cookie('jwt', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 3600000,
    });
    // Lógica para iniciar sesión
    const sesion = await this.sesionService.crearSesion(user.id);
    res.cookie('sesionId', sesion.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 3600000,
    });
    return { message: 'Login exitoso' };
  }
  
  @Get('verificar-correo')
  @HttpCode(HttpStatus.OK)
  async verificarCorreo(@Query('token') token: string) {
    return this.authService.verificarCorreo(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: UserRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: UserRequest, @Res({ passthrough: true }) res: Response) {
    // Lógica para finalizar sesión
    const sesionId = parseInt(req.cookies.sesionId, 10);
    if (sesionId) {
      await this.sesionService.finalizarSesion(sesionId);
    }
    
    await this.usuariosService.actualizarEstado(req.user.id, false);
    await this.usuariosService.actualizarUltimaSesion(req.user.id, new Date());
    res.clearCookie('jwt', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.clearCookie('sesionId', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });
    const usuarios = await this.usuariosService.findAll();
    this.socketGateway.server.emit('usuariosActualizados', usuarios);
    return { message: 'Sesión cerrada correctamente' };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('admin/users')
  async getAllUsersForAdmin(@Req() req: UserRequest): Promise<Usuario[]> {
    if (!req.user.esAdmin) {
      throw new UnauthorizedException('Acceso no autorizado. Solo para administradores.');
    }
    return this.usuariosService.findAll();
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: SolicitarResetDto) {
    return this.authService.solicitarReset(requestPasswordResetDto);
  }
  
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.confirmarReset(resetPasswordDto);
  }
}