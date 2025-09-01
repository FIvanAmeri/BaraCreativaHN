'use client';

import React from 'react';
import { formatDuration } from '@/app/utils/helpers';

interface Usuario {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  tipoUsuario: string;
  nombreEmpresa?: string;
  estadoCuenta: string;
  estaConectado: boolean;
  esAdmin: boolean;
  ultimaSesion?: string;
  fotoPerfil?: string;
}

interface UserWithSessionData extends Usuario {
  duracionUltimaSesion?: number;
  duracionTotalConectado?: number;
}

interface Props {
  usuarios: UserWithSessionData[];
}

const TablaInfoSesion: React.FC<Props> = ({ usuarios }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Última Sesión</th>
            <th className="py-2 px-4 border-b">Duración Última Sesión</th>
            <th className="py-2 px-4 border-b">Tiempo Total Conectado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b text-center">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.nombreCompleto}</td>
              <td className="py-2 px-4 border-b">{user.correoElectronico}</td>
              <td className="py-2 px-4 border-b">{user.ultimaSesion ? new Date(user.ultimaSesion).toLocaleString() : 'N/A'}</td>
              <td className="py-2 px-4 border-b text-center">
                {formatDuration(user.duracionUltimaSesion)}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {formatDuration(user.duracionTotalConectado)}
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4">No se encontraron usuarios que coincidan con los criterios de búsqueda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaInfoSesion;