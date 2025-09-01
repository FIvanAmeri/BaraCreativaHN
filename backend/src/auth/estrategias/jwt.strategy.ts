import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Usuario } from '../../entidades/usuario.entity';

interface JwtPayload {
  sub?: number;
  id?: number;
  correoElectronico: string;
  esAdmin?: boolean; 
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService,
  ) {
    const jwtSecret = configService.get('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.jwt || null;
        },
   
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<Usuario> {
    this.logger.log(`JwtStrategy: Validando payload: ${JSON.stringify(payload)}`);
    

    const userId = payload.sub || payload.id;

    if (typeof userId !== 'number') {
      this.logger.error('JwtStrategy: Error de validación: ID de usuario no numérico.');
      throw new UnauthorizedException('Token inválido: ID de usuario no numérico.');
    }

    const usuario = await this.usuariosService.encontrarPorId(userId);

    if (!usuario) {
      this.logger.warn('JwtStrategy: Error de validación: Usuario no encontrado.');
      throw new UnauthorizedException('Token inválido o usuario no encontrado.');
    }

    return usuario;
  }
}