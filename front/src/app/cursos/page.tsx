'use client';

import { useState, useEffect } from 'react';
import { Curso } from '@/app/types/curso';
import Link from 'next/link';
import Image from 'next/image';
import { PanelTarjeta } from '@/components/ScormID/PanelTarjeta';


export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';


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
      <div className="text-center text-lg mt-8 text-text-light animate-pulse drop-shadow-cyber-glow-cyan">
        <p>Cargando lista de cursos...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="text-red-500 text-center mt-8 p-6 bg-mid-dark-bg border border-border-glitch rounded-lg shadow-xl animate-fade-in-up relative overflow-hidden">
        <p className="font-bold mb-3 text-2xl text-accent-magenta drop-shadow-cyber-glow-magenta">¡ERROR DETECTADO!</p>
        <p className="text-text-light text-base mb-4">{error}</p>
        <p className="mt-4 text-sm text-text-muted">Interferencia detectada. Reintenta la conexión o contacta al operador de soporte.</p>
      </div>
    );
  }


  if (!cursos || cursos.length === 0) {
    return (
      <div className="text-center text-lg mt-8 text-text-light drop-shadow-cyber-glow-cyan">
        <p>No se encontraron cursos disponibles.</p>
      </div>
    );
  }


  return (
    <div className="p-6 md:p-8 lg:p-12 bg-dark-bg rounded-2xl shadow-xl text-text-light font-sans max-w-sm sm:max-w-md md:max-w-4xl xl:max-w-6xl mx-auto my-8 md:my-12">
      <div className="text-center">
        <h1 className="mb-12 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta drop-shadow-cyber-glow-magenta animate-fade-in-up">
          Catálogo de Cursos
        </h1>
      </div>
      
   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {cursos.map((curso) => (
          <PanelTarjeta key={curso.id} colorBordeHover="accent-cyan" conEfectoBrilloImagen>
            <div className="flex flex-col h-full">
              {curso.imagenCurso && typeof curso.imagenCurso === 'string' && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={`${API_BASE_URL}/${curso.imagenCurso}`}
                    alt={`Imagen de ${curso.titulo}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    unoptimized={true} 
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold text-accent-lime mb-2">{curso.titulo}</h2>
              <p className="text-sm text-text-muted mb-4 line-clamp-3 flex-grow">{curso.descripcion}</p>
              <Link href={`/cursos/${curso.id}`}>
                <div className="text-center font-bold py-2 px-4 rounded-full transition-all duration-300
                            bg-accent-cyan text-dark-bg hover:bg-accent-magenta hover:text-white
                            shadow-md hover:shadow-lg drop-shadow-cyber-glow-cyan hover:drop-shadow-cyber-glow-magenta
                            animate-pulse-light">
                  Ver Detalles
                </div>
              </Link>
            </div>
          </PanelTarjeta>
        ))}
      </div>
    </div>
  );
}
