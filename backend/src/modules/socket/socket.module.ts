import { Module, forwardRef } from '@nestjs/common';
import { SocketGateway } from '../../socket/socket.gateway';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [forwardRef(() => UsuariosModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
