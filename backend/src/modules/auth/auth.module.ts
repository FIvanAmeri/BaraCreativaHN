// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from '../../controllers/auth/auth.controller';
import { JwtStrategy } from '../../auth/estrategias/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from '../../modules/usuarios/usuarios.module';
import { AuthService } from '../../services/auth/auth.service';
import { SocketModule } from '../socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../entidades/usuario.entity';
import { MailModule } from '../../mail/mail.module';
import { SesionModule } from '../sesion/sesion.module'; 

@Module({
  imports: [
    PassportModule,
    UsuariosModule,
    SocketModule,
    SesionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([Usuario]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}