import React from 'react';

interface Props {
  seleccionarVista: (vista: 'usuarios' | 'cursos' | 'agregarUsuario') => void;
}

export default function MenuAdmin({ seleccionarVista }: Props) {
  return (
    <nav className="flex flex-row overflow-x-auto md:flex-col md:p-4 md:space-y-4 w-full md:w-48 bg-gray-100 p-2 space-x-2 md:space-x-0">
      <button
        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => seleccionarVista('usuarios')}
      >
        Usuarios
      </button>
      <button
        className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => seleccionarVista('cursos')}
      >
        Listado de Cursos
      </button>
      <button
        className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        onClick={() => seleccionarVista('agregarUsuario')}
      >
        Agregar nuevo usuario
      </button>
    </nav>
  );
}