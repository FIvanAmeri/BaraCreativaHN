import React from 'react';

interface Props {
  seleccionarVista: (vista: 'usuarios' | 'cursos' | 'agregarUsuario') => void;
}

export default function MenuAdmin({ seleccionarVista }: Props) {
  return (
    <nav className="flex flex-row md:flex-col w-full md:w-48 bg-gray-100 p-2 md:p-4 justify-between md:justify-start space-x-2 md:space-x-0 md:space-y-4 overflow-x-auto whitespace-nowrap">
      <button
        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex-shrink-0"
        onClick={() => seleccionarVista('usuarios')}
      >
        Usuarios
      </button>
      <button
        className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 flex-shrink-0"
        onClick={() => seleccionarVista('cursos')}
      >
        Listado de Cursos
      </button>
      <button
        className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 flex-shrink-0"
        onClick={() => seleccionarVista('agregarUsuario')}
      >
        Agregar nuevo usuario
      </button>
    </nav>
  );
}