import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<Function>
  ) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value!);
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { esAdmin: boolean };

    if (!user) {
      this.logger.warn(
        'RolesGuard: Intento de acceso a ruta protegida sin usuario.',
      );
      throw new UnauthorizedException('Acceso denegado. Usuario no autenticado.');
    }

    const isAdminRequired = requiredRoles.includes('admin');
    const isUserAdmin = user.esAdmin === true;

    if (isAdminRequired && !isUserAdmin) {
      this.logger.warn(
        'RolesGuard: Usuario autenticado pero no es un administrador.',
      );
      throw new ForbiddenException('No tienes los permisos necesarios para esta acción.');
    } else if (!isAdminRequired) {
      this.logger.log('RolesGuard: Acceso permitido a ruta no restringida.');
      return true;
    }

    this.logger.log('RolesGuard: Acceso de administrador permitido.');
    return true;
  }
}