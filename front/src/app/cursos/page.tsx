'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Curso } from '@/app/types/curso';
import { PanelTarjeta } from '@/components/ScormID/PanelTarjeta';
import { FaMicrochip } from 'react-icons/fa';

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('Todo');

  useEffect(() => {
    const fetchCursosData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cursos`, { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener la lista de cursos');
        const fetchedCursos: Curso[] = await response.json();
        setCursos(fetchedCursos);
        setError(null);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) setError(err.message);
        else setError('Ocurrió un error desconocido.');
      } finally {
        setLoading(false);
      }
    };
    fetchCursosData();
  }, []);

  const cursosFiltradosPorCategoria = cursos.filter((curso) => {
    if (filtro === 'Todo') return true;
    if (filtro === 'CAT' || filtro === 'Dynamis')
      return curso.categoria?.toLowerCase() === filtro.toLowerCase();
    if (filtro === 'Cursos') return curso.claseItem === 'curso';
    if (filtro === 'Servicios') return curso.claseItem === 'servicio';
    return true;
  });

  const cursosCursos = cursosFiltradosPorCategoria.filter(curso => curso.claseItem === 'curso');
  const cursosServicios = cursosFiltradosPorCategoria.filter(curso => curso.claseItem === 'servicio');

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
      <h1
        className="relative -top-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-8 pt-16
                   text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta
                   drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] animate-fade-in-up"
      >
        Catálogo
      </h1>

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

      {(filtro === 'Todo' || filtro === 'Cursos' || filtro === 'CAT' || filtro === 'Dynamis') && (
        <div className="mb-12">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-left mb-8
                       text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400"
          >
            Cursos
          </h2>
          {cursosCursos.length === 0 ? (
            <p className="text-left text-gray-400">No hay cursos disponibles para este filtro.</p>
          ) : (
            <div className="flex flex-wrap gap-4 justify-start">
              {cursosCursos.map((curso) => (
                <PanelTarjeta
                  key={curso.id}
                  claseAdicional="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex flex-col min-h-[400px]"
                  conEfectoEscaneo
                >
                  <Link
                    href={`/cursos/${curso.id}`}
                    className="flex flex-col h-full p-4 hover:cursor-pointer"
                  >
                    {/* Imagen */}
                    <div className="flex-shrink-0 w-full h-32 mb-4 relative">
                      {curso.imagenCurso && typeof curso.imagenCurso === 'string' ? (
                        <img
                          src={curso.imagenCurso}
                          alt={`Imagen de ${curso.titulo}`}
                          className="w-full h-full object-cover rounded-md border border-gray-700 shadow-lg transition-colors duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-70 rounded-md"></div>
                    </div>

                    {/* Título */}
                    <h2 className="text-lg md:text-xl font-bold text-center text-cyan-400 mb-2 line-clamp-2 h-[3rem]">
                      {curso.titulo}
                    </h2>

                    {/* Descripción */}
                    <p className="text-xs text-gray-400 text-center mb-2 line-clamp-3 h-[3.5rem] px-2">
                      {curso.descripcion}
                    </p>

                    {/* Precio al fondo */}
                    <p className="mt-auto font-semibold text-base text-lime-400 text-center">
                      💲 Precio: <span className="text-gray-200">${curso.precio}</span>
                    </p>
                  </Link>
                </PanelTarjeta>
              ))}
            </div>
          )}
        </div>
      )}

      {(filtro === 'Todo' || filtro === 'Servicios' || filtro === 'CAT' || filtro === 'Dynamis') && (
        <div className="mb-12">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-left mb-8
                       text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400"
          >
            Servicios
          </h2>
          {cursosServicios.length === 0 ? (
            <p className="text-left text-gray-400">No hay servicios disponibles para este filtro.</p>
          ) : (
            <div className="flex flex-wrap gap-4 justify-start">
              {cursosServicios.map((servicio) => (
                <PanelTarjeta
                  key={servicio.id}
                  claseAdicional="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex flex-col min-h-[400px]"
                  conEfectoEscaneo
                >
                  <Link
                    href={`/cursos/${servicio.id}`}
                    className="flex flex-col h-full p-4 hover:cursor-pointer"
                  >
                    {/* Imagen */}
                    <div className="flex-shrink-0 w-full h-32 mb-4 relative">
                      {servicio.imagenCurso && typeof servicio.imagenCurso === 'string' ? (
                        <img
                          src={servicio.imagenCurso}
                          alt={`Imagen de ${servicio.titulo}`}
                          className="w-full h-full object-cover rounded-md border border-gray-700 shadow-lg transition-colors duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-70 rounded-md"></div>
                    </div>

                    {/* Título */}
                    <h2 className="text-lg md:text-xl font-bold text-center text-cyan-400 mb-2 line-clamp-2 h-[3rem]">
                      {servicio.titulo}
                    </h2>

                    {/* Descripción */}
                    <p className="text-xs text-gray-400 text-center mb-2 line-clamp-3 h-[3.5rem] px-2">
                      {servicio.descripcion}
                    </p>

                    {/* Precio al fondo */}
                    <p className="mt-auto font-semibold text-base text-lime-400 text-center">
                      💲 Precio: <span className="text-gray-200">${servicio.precio}</span>
                    </p>
                  </Link>
                </PanelTarjeta>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
