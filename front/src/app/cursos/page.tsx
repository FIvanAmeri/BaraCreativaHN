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

  useEffect(() => {
    const fetchCursosData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cursos`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error al obtener la lista de cursos');
        }
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


  const cursosCursos = cursos.filter(curso => curso.claseItem === 'curso');
  const cursosServicios = cursos.filter(curso => curso.claseItem === 'servicio');

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

  return (
    <div className="bg-gray-950 min-h-screen text-gray-200 py-16 px-4 md:px-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-12
                     text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta
                     drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] animate-fade-in-up -mt-8">
        Catálogo
      </h1>

 
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8
                       text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">
          Cursos
        </h2>
        {cursosCursos.length === 0 ? (
          <p className="text-center text-gray-400">No hay cursos disponibles en este momento.</p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center items-stretch">
            {cursosCursos.map(curso => (
              <PanelTarjeta key={curso.id} claseAdicional="w-full sm:w-1/2 md:w-1/3 lg:w-1/4" conEfectoEscaneo>
                <div className="flex flex-col items-center p-4">
                  {curso.imagenCurso && typeof curso.imagenCurso === 'string' && (
                    <div className="relative w-full h-48 mb-4">
                      <img
                        src={curso.imagenCurso}
                        alt={`Imagen de ${curso.titulo}`}
                        className="w-full h-full object-cover rounded-md border border-gray-700 shadow-lg hover:border-cyan-400 transition-colors duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-70 rounded-md"></div>
                    </div>
                  )}
                  <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-cyan-400">
                    {curso.titulo}
                  </h2>
                  <p className="text-sm text-gray-400 text-center mb-4 truncate w-full px-2">
                    {curso.descripcion}
                  </p>
                  
                  <div className="flex flex-col items-center w-full mt-auto">
                    <p className="font-semibold text-lg text-lime-400 mb-4">
                      💲 Precio: <span className="text-gray-200">${curso.precio}</span>
                    </p>
                    <Link href={`/cursos/${curso.id}`} passHref>
                      <button className="relative w-full md:w-auto px-6 py-3 rounded-md bg-transparent border-2 border-cyan-400 text-gray-200 font-bold text-lg
                                         uppercase tracking-wider overflow-hidden group
                                         transition-colors duration-300">
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-gray-950">
                          Ver Detalles
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-magenta-400 transform scale-x-0
                                         group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                        <span className="absolute inset-0 border border-gray-200 opacity-0 group-hover:opacity-100 animate-pulse-light
                                         transition-opacity duration-300"></span>
                      </button>
                    </Link>
                  </div>
                </div>
              </PanelTarjeta>
            ))}
          </div>
        )}
      </div>


      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8
                       text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">
          Servicios
        </h2>
        {cursosServicios.length === 0 ? (
          <p className="text-center text-gray-400">No hay servicios disponibles en este momento.</p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center items-stretch">
            {cursosServicios.map(servicio => (
              <PanelTarjeta key={servicio.id} claseAdicional="w-full sm:w-1/2 md:w-1/3 lg:w-1/4" conEfectoEscaneo>
                <div className="flex flex-col items-center p-4">
                  {servicio.imagenCurso && typeof servicio.imagenCurso === 'string' && (
                    <div className="relative w-full h-48 mb-4">
                      <img
                        src={servicio.imagenCurso}
                        alt={`Imagen de ${servicio.titulo}`}
                        className="w-full h-full object-cover rounded-md border border-gray-700 shadow-lg hover:border-cyan-400 transition-colors duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-70 rounded-md"></div>
                    </div>
                  )}
                  <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-cyan-400">
                    {servicio.titulo}
                  </h2>
                  <p className="text-sm text-gray-400 text-center mb-4 truncate w-full px-2">
                    {servicio.descripcion}
                  </p>
                  
                  <div className="flex flex-col items-center w-full mt-auto">
                    <p className="font-semibold text-lg text-lime-400 mb-4">
                      💲 Precio: <span className="text-gray-200">${servicio.precio}</span>
                    </p>
                    <Link href={`/cursos/${servicio.id}`} passHref>
                      <button className="relative w-full md:w-auto px-6 py-3 rounded-md bg-transparent border-2 border-cyan-400 text-gray-200 font-bold text-lg
                                         uppercase tracking-wider overflow-hidden group
                                         transition-colors duration-300">
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-gray-950">
                          Ver Detalles
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-magenta-400 transform scale-x-0
                                         group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                        <span className="absolute inset-0 border border-gray-200 opacity-0 group-hover:opacity-100 animate-pulse-light
                                         transition-opacity duration-300"></span>
                      </button>
                    </Link>
                  </div>
                </div>
              </PanelTarjeta>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
