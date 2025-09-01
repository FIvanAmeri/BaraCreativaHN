import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../entidades/usuario.entity';
import { UsuariosController } from '../../controllers/usuarios/usuarios.controller';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from '../../modules/cloudinary/cloudinary.module';
import { SocketModule } from 'src/modules/socket/socket.module';
import { Sesion } from '../../entidades/sesion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Sesion]),
    forwardRef(() => SocketModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CloudinaryModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService, JwtModule],
})
export class UsuariosModule {}
