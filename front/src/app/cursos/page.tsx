'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Curso } from '@/app/types/curso';
import { PanelTarjeta } from '@/components/ScormID/PanelTarjeta';
import { FaMicrochip } from 'react-icons/fa';

// Definición de tipos para los valores del filtro
type FilterOption = 'Todo' | 'Cursos' | 'Servicios' | 'CAT' | 'Dynamis';

export default function CursosPage() {
  // Aseguramos que el estado del filtro sea uno de los valores definidos
  const [filtro, setFiltro] = useState<FilterOption>('Todo');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCursosData = async () => {
      try {
        setLoading(true);
        // La API call es la misma, no hay necesidad de cambiarla
        const response = await fetch(`/api/cursos`, { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener la lista de cursos');
        const fetchedCursos: Curso[] = await response.json();
        setCursos(fetchedCursos);
        setError(null);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCursosData();
  }, []);

  // Lógica de filtrado mejorada y más legible
  const cursosFiltrados = cursos.filter((curso) => {
    switch (filtro) {
      case 'Todo':
        return true;
      case 'Cursos':
        return curso.claseItem === 'curso';
      case 'Servicios':
        return curso.claseItem === 'servicio';
      case 'CAT':
        return curso.categoria?.toLowerCase() === 'cat';
      case 'Dynamis':
        return curso.categoria?.toLowerCase() === 'dynamis';
      default:
        // Si el filtro no coincide con nada, no mostramos nada
        return false;
    }
  });

  // Vista de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-cyan-400">
        <p className="text-xl animate-pulse drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]">
          <FaMicrochip className="inline-block animate-spin mr-2" />
          Cargando datos interdimensionales...
        </p>
      </div>
    );
  }

  // Vista de error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-center">
        <div className="p-8 border border-red-500 rounded-lg shadow-xl animate-fade-in-up">
          <h2 className="text-2xl font-bold text-red-400">Error al cargar cursos</h2>
          <p className="mt-4 text-sm text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  const baseButtonClasses = 'px-6 py-2 rounded-full font-bold text-lg transition-colors duration-300';
  const activeClasses = 'bg-cyan-500 text-gray-900 shadow-md transform scale-105';
  const inactiveClasses = 'bg-gray-800 text-gray-200 hover:bg-gray-700';

  return (
    <div className="bg-gray-950 min-h-screen text-gray-200 py-16 px-4 md:px-8">
      <div className="flex justify-center space-x-4 mb-12 flex-wrap gap-2">
        <button
          onClick={() => setFiltro('Todo')}
          className={`${baseButtonClasses} ${filtro === 'Todo' ? activeClasses : inactiveClasses}`}
        >
          Todo
        </button>
        <button
          onClick={() => setFiltro('Cursos')}
          className={`${baseButtonClasses} ${filtro === 'Cursos' ? activeClasses : inactiveClasses}`}
        >
          Cursos
        </button>
        <button
          onClick={() => setFiltro('Servicios')}
          className={`${baseButtonClasses} ${filtro === 'Servicios' ? activeClasses : inactiveClasses}`}
        >
          Servicios
        </button>
        <button
          onClick={() => setFiltro('CAT')}
          className={`${baseButtonClasses} ${filtro === 'CAT' ? activeClasses : inactiveClasses}`}
        >
          CAT
        </button>
        <button
          onClick={() => setFiltro('Dynamis')}
          className={`${baseButtonClasses} ${filtro === 'Dynamis' ? activeClasses : inactiveClasses}`}
        >
          Dynamis
        </button>
      </div>

      {/* Sección unificada para Cursos y Servicios */}
      <div className="mb-12">
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-left mb-8
            text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400"
        >
          {filtro === 'Servicios' ? 'Servicios' : 'Cursos'}
        </h2>
        {cursosFiltrados.length === 0 ? (
          <p className="text-left text-gray-400">No hay elementos disponibles para este filtro.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cursosFiltrados.map((item) => (
              <PanelTarjeta
                key={item.id}
                claseAdicional="rounded-lg shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105 hover:ring-2 hover:ring-cyan-500/50 relative overflow-hidden group"
              >
                <Link
                  href={`/cursos/${item.id}`}
                  className="flex flex-col h-full hover:cursor-pointer"
                >
                  <div className="w-full relative aspect-video rounded-t-lg overflow-hidden border-b border-gray-700 bg-gray-800 flex items-center justify-center">
                    {item.imagenCurso && typeof item.imagenCurso === 'string' ? (
                      <img
                        src={item.imagenCurso}
                        alt={`Imagen de ${item.titulo}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">Sin imagen</div>
                    )}
                    {/* Overlay sutil al pasar el mouse */}
                    <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex flex-col flex-grow p-4">
                    <h2 className="text-xl md:text-2xl font-bold text-left text-cyan-400 line-clamp-2 leading-tight">
                      {item.titulo}
                    </h2>
                    <p className="text-sm text-gray-400 text-left line-clamp-3 mt-2 flex-grow">
                      {item.descripcion}
                    </p>
                  </div>
                </Link>
              </PanelTarjeta>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
