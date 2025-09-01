import React from 'react';

interface Props {
  seleccionarVista: (vista: 'usuarios' | 'cursos' | 'agregarUsuario' | 'infoSesion') => void;
}

export default function MenuAdmin({ seleccionarVista }: Props) {
  return (
    <nav className="flex flex-col w-full md:w-48 bg-gray-100 p-2 md:p-4 justify-start space-y-4">
      <button
        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        onClick={() => seleccionarVista('usuarios')}
      >
        Usuarios
      </button>
      <button
        className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 w-full"
        onClick={() => seleccionarVista('cursos')}
      >
        Listado de Cursos
      </button>
      <button
        className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 w-full"
        onClick={() => seleccionarVista('agregarUsuario')}
      >
        Agregar nuevo usuario
      </button>
      <button
        className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 w-full"
        onClick={() => seleccionarVista('infoSesion')}
      >
        Información de Sesión
      </button>
    </nav>
  );
}