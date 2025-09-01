import { Usuario } from './auth';

export interface Sesion {
  id: number;
  usuario: Usuario;
  usuarioId: number;
  fechaInicio: string;
  fechaFin?: string;
  duracionSegundos: number;
}