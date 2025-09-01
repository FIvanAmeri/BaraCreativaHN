import React from 'react';
import { Curso, ClaseItem } from '@/app/types/curso';
import toast from 'react-hot-toast'; 

interface Props {
  cursos: Curso[];
  onEditar: (curso: Curso) => void;
  onEliminar: (id: number) => void;
}

export default function TablaCursosAdmin({ cursos, onEditar, onEliminar }: Props) {
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLaunchScorm = (scormPath: string | null | undefined) => {
    if (scormPath) {
      window.open(`${backendBaseUrl}${scormPath}`, '_blank');
    } else {
      toast.error('Este item no tiene un paquete SCORM asociado.');
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SCORM</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cursos.map((curso) => (
            <tr key={curso.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{curso.titulo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  curso.claseItem === ClaseItem.CURSO ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {curso.claseItem === ClaseItem.CURSO ? 'Curso' : 'Servicio'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{curso.categoria}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {curso.claseItem === ClaseItem.CURSO ? curso.modalidad : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${Number(curso.precio).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                {curso.archivoScorm ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    SCORM Disponible
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    No SCORM
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                <button
                  onClick={() => onEditar(curso)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar(curso.id)}
                  className="text-red-600 hover:text-red-900 mr-3"
                >
                  Eliminar
                </button>
                {/* {curso.archivoScorm && (
                  <button
                    onClick={() => handleLaunchScorm(curso.archivoScorm)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Lanzar SCORM
                  </button>
                )} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
