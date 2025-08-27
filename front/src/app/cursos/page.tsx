'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Curso } from '@/app/types/curso';
import { PanelTarjeta } from '@/components/ScormID/PanelTarjeta';
import { FaPlay, FaMicrochip } from 'react-icons/fa'; 


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


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-bg text-accent-cyan">
        <p className="text-xl animate-pulse">
          <FaMicrochip className="inline-block animate-spin mr-2" />
          Cargando datos interdimensionales...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-bg text-accent-magenta text-center">
        <div className="p-8 border border-border-glitch rounded-lg shadow-xl animate-fade-in-up">
          <h2 className="text-2xl font-bold">Error al cargar cursos</h2>
          <p className="mt-4 text-sm">{error}</p>
        </div>
        </div>
    );
  }


  if (cursos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-bg text-text-light">
        <p className="text-xl">No se encontraron cursos disponibles. ¡Creemos uno!</p>
      </div>
    );
  }

 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  return (
    <div className="bg-dark-bg min-h-screen text-text-light py-16 px-4 md:px-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-12
                     text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta
                     drop-shadow-cyber-glow-magenta animate-fade-in-up">
        Catálogo
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {cursos.map(curso => (
          <PanelTarjeta key={curso.id} claseAdicional="w-full max-w-sm" conEfectoEscaneo>
            <div className="flex flex-col items-center p-4">
              {curso.imagenCurso && typeof curso.imagenCurso === 'string' && (
                <div className="relative w-full h-48 mb-4">
                  <img
                    src={curso.imagenCurso}
                    alt={`Imagen de ${curso.titulo}`}
                    className="w-full h-full object-cover rounded-md border border-mid-dark-bg shadow-lg hover:border-accent-cyan transition-colors duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-70 rounded-md"></div>
                </div>
              )}
              <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-accent-cyan">
                {curso.titulo}
              </h2>
              <p className="text-sm text-text-muted text-center mb-4 truncate w-full px-2">
                {curso.descripcion}
              </p>
              
              <div className="flex flex-col items-center w-full mt-auto">
                <p className="font-semibold text-lg text-accent-lime mb-4">
                  💲 Precio: <span className="text-text-light">${curso.precio}</span>
                </p>
                <Link href={`/cursos/${curso.id}`} passHref>
                  <button className="relative w-full md:w-auto px-6 py-3 rounded-md bg-transparent border-2 border-accent-cyan text-text-light font-bold text-lg
                                     uppercase tracking-wider overflow-hidden group
                                     transition-colors duration-300">
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-dark-bg">
                      Ver Detalles
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta transform scale-x-0
                                     group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    <span className="absolute inset-0 border border-text-light opacity-0 group-hover:opacity-100 animate-pulse-light
                                     transition-opacity duration-300"></span>
                  </button>
                </Link>
              </div>
            </div>
          </PanelTarjeta>
        ))}
      </div>
    </div>
  );
}
