import React from 'react';
import { Usuario } from '@/app/types/auth';

interface UsuarioConSesion extends Usuario {
  duracionUltimaSesion?: number;
  duracionTotalConectado?: number;
}

interface Props {
  usuarios: UsuarioConSesion[];
}

const formatDuration = (segundos: number): string => {
  if (segundos === undefined || segundos === null || isNaN(segundos)) {
    return '0s';
  }

  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const segundosRestantes = segundos % 60;
  const minutosRestantes = minutos % 60;

  let resultado = '';
  if (horas > 0) {
    resultado += `${horas}h `;
  }
  if (minutosRestantes > 0) {
    resultado += `${minutosRestantes}m `;
  }
  resultado += `${segundosRestantes}s`;

  return resultado.trim();
};

const TablaInfoSesion: React.FC<Props> = ({ usuarios }) => {
  // Ordena los usuarios por ID de forma ascendente
  const usuariosOrdenados = [...usuarios].sort((a, b) => a.id - b.id);

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-2 border-r border-gray-300">ID</th>
            <th className="p-2 border-r border-gray-300">Nombre</th>
            <th className="p-2 border-r border-gray-300">Email</th>
            <th className="p-2 border-r border-gray-300">Última Sesión</th>
            <th className="p-2 border-r border-gray-300">Duración Última Sesión</th>
            <th className="p-2">Tiempo Total Conectado</th>
          </tr>
        </thead>
        <tbody>
          {usuariosOrdenados.length > 0 ? (
            usuariosOrdenados.map((u) => (
              <tr key={u.id} className="text-center border-t border-gray-300 hover:bg-yellow-50">
                <td className="p-2 border-r border-gray-300">{u.id}</td>
                <td className="p-2 border-r border-gray-300">{u.nombreCompleto}</td>
                <td className="p-2 border-r border-gray-300">{u.correoElectronico}</td>
                <td className="p-2 border-r border-gray-300">
                  {u.ultimaSesion
                    ? new Date(u.ultimaSesion).toLocaleString()
                    : 'N/A'}
                </td>
                <td className="p-2 border-r border-gray-300">
                  {u.duracionUltimaSesion !== undefined
                    ? formatDuration(u.duracionUltimaSesion)
                    : 'N/A'}
                </td>
                <td className="p-2">
                  {u.duracionTotalConectado !== undefined
                    ? formatDuration(u.duracionTotalConectado)
                    : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No se encontraron usuarios que coincidan con los criterios de búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaInfoSesion;
