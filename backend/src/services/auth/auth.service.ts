import {
  Injectable,
  BadRequestException,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario, TipoUsuario, EstadoCuenta } from '../../entidades/usuario.entity';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';
import { randomUUID } from 'crypto';
import { SolicitarResetDto } from '../../dto/password/solicitar-reset.dto';
import { ConfirmarResetDto } from '../../dto/password/confirmar-reset.dto';
import { CreateUsuarioDto } from '../../dto/crear-editar-usuarios/create-usuario.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private adminEmail: string;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    const emailUserConfig = this.configService.get('email.user', { infer: true });
    if (!emailUserConfig) {
      throw new Error(
        'La variable de entorno EMAIL_USER (para email de administrador) no está configurada. Por favor, verifique su archivo .env',
      );
    }
    this.adminEmail = emailUserConfig as string;
  }

  async validarUsuarioYGenerarToken(
    correoElectronico: string,
    password: string,
  ): Promise<string | null> {
    const usuario = await this.usuariosService.encontrarPorCorreo(correoElectronico);
    if (!usuario) return null;
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return null;

    const payload = {
      sub: usuario.id,
      correoElectronico: usuario.correoElectronico,
    };

    return this.jwtService.sign(payload);
  }

  async registrarUsuario(data: CreateUsuarioDto): Promise<Usuario> {
    const usuarioExistente = await this.userRepository.findOne({
      where: { correoElectronico: data.correoElectronico },
    });

    if (usuarioExistente) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }

    const hash = await bcrypt.hash(data.password, 10);

    const tokenVerificacion = randomUUID();

    const nuevoUsuario = this.userRepository.create({
      ...data,
      password: hash,
      estadoCuenta: EstadoCuenta.Activo,
      esAdmin: data.tipoUsuario === 'Admin',
      tokenVerificacionCorreo: tokenVerificacion,
      correoConfirmado: false,
    });

    try {
      await this.userRepository.save(nuevoUsuario);

      const frontendUrl = this.configService.get('FRONTEND_URL');
      const verificationLink = `${frontendUrl}/verificar-correo?token=${tokenVerificacion}`;

      await this.mailService.sendVerificationEmail(nuevoUsuario.correoElectronico, nuevoUsuario.nombreCompleto, verificationLink);

      return nuevoUsuario;
    } catch (error) {
      this.logger.error('Error al registrar usuario y enviar correo de verificación', error.stack);
      throw new InternalServerErrorException('Error al registrar usuario');
    }
  }

  async login(correoElectronico: string, password: string) {
    const usuario = await this.usuariosService.encontrarPorCorreo(correoElectronico);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (!usuario.correoConfirmado) {
      throw new UnauthorizedException('Por favor, confirma tu correo electrónico para poder iniciar sesión.');
    }

    const payload = { sub: usuario.id, correoElectronico: usuario.correoElectronico };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async solicitarReset(dto: SolicitarResetDto) {
    const user = await this.userRepository.findOne({
      where: { correoElectronico: dto.correoElectronico },
    });

    if (!user) {
      this.logger.warn(`Intento de recuperación de contraseña para correo no registrado: ${dto.correoElectronico}`);
      return {
        message:
          'Si tu correo está registrado, recibirás un enlace/código para restablecer tu contraseña.',
      };
    }

    const recoveryCode = randomUUID();
    const resetUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/reset-password/${recoveryCode}`;

    user.tokenRecuperacion = recoveryCode;
    user.expiracionTokenRecuperacion = new Date(Date.now() + 3600000); // 1 hora
    await this.userRepository.save(user);

    try {
      const userName = user.nombreCompleto;
      await this.mailService.sendPasswordRecoveryEmailToUser(
        user.correoElectronico,
        userName,
        recoveryCode,
        resetUrl,
      );

      if (this.adminEmail) {
        await this.mailService.sendPasswordRecoveryNotificationToAdmin(
          this.adminEmail,
          user.correoElectronico,
          userName,
          recoveryCode,
        );
      }
    } catch (error) {
      this.logger.error('Error enviando email de recuperación de contraseña', error);
      return {
        message:
          'Si tu correo está registrado, recibirás un enlace/código para restablecer tu contraseña.',
      };
    }

    return {
      message:
        'Si tu correo está registrado, recibirás un enlace/código para restablecer tu contraseña.',
    };
  }

  async confirmarReset(dto: ConfirmarResetDto) {
    const user = await this.userRepository.findOne({
      where: {
        tokenRecuperacion: dto.token,
      },
    });

    if (!user || !user.expiracionTokenRecuperacion || user.expiracionTokenRecuperacion < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const newHashedPassword = await bcrypt.hash(dto.password, 10);
    user.password = newHashedPassword;
    user.tokenRecuperacion = null;
    user.expiracionTokenRecuperacion = null;

    await this.userRepository.save(user);

    return { message: 'Contraseña restablecida exitosamente' };
  }

  async verificarCorreo(token: string) {
    const usuario = await this.userRepository.findOne({
      where: { tokenVerificacionCorreo: token },
    });

    if (!usuario) {
      throw new BadRequestException('Token de verificación inválido o expirado');
    }

    usuario.correoConfirmado = true;
    usuario.tokenVerificacionCorreo = null;
    
    await this.userRepository.save(usuario);

    return { message: 'Correo verificado exitosamente. Ahora puedes iniciar sesión.' };
  }
}
