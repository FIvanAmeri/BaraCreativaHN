'use client';

import { useParams } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';

import { useCursoScorm } from '@/app/hooks/Scorm/useCursoScorm';
import { Curso } from '@/app/types/curso';

import BarraProgreso from '@/components/Scorm/BarraProgreso';
import ListaModulos from '@/components/Scorm/ListaModulos';
import MensajeFinal from '@/components/Scorm/MensajeFinal';
import Navegacion from '@/components/Scorm/Navegacion';
import ContenedorContenido from '@/components/Scorm/ContenedorContenido';

export default function ScormPage() {
  const params = useParams();
  const cursoId = params.id as string;

  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchCursoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cursos/${cursoId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error al obtener el curso');
        }
        const data: Curso = await response.json();
        setCurso(data);
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
    fetchCursoData();
  }, [cursoId]);

 
  const {
    modulosEstadoUsuario,
    currentModuleIndex,
    cursoCompletadoGeneral,
    handleNavigation,
    handleModuleClick,
    progresoGeneral,
    currentModule,
    currentContentUrl,
    disablePrev,
    disableNext,
  } = useCursoScorm(curso?.modulos || []);


  if (loading) return <p className="text-center mt-8 text-lg text-gray-700">Cargando curso y módulos...</p>;
  if (error) return <p className="text-red-600 text-center mt-8 text-lg font-bold">Error al cargar el curso: {error}</p>;
  if (!curso) return <p className="text-center mt-8 text-lg text-gray-700">No hay contenido disponible para este curso.</p>;
  if (!currentModule) return <p className="text-center mt-8 text-lg text-gray-700">No hay contenido disponible para este módulo.</p>;

 
  const tipoContenido = currentModule.tipo !== null ? currentModule.tipo : 'texto';
  const contenidoTexto = currentModule.tipo === 'texto' ? currentModule.descripcion : undefined;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 gap-4">
        <div className="lg:w-1/4 bg-white rounded-lg shadow-lg p-6 flex flex-col overflow-hidden">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Módulos del Curso</h2>
          <BarraProgreso progreso={progresoGeneral} />
          <ListaModulos
            modulos={modulosEstadoUsuario}
            currentModuleIndex={currentModuleIndex}
            onModuleClick={handleModuleClick}
          />
        </div>

     
        <div className="lg:w-3/4 bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <MensajeFinal mostrar={cursoCompletadoGeneral} />

          <h1 className="text-3xl font-bold mb-4 text-gray-900">{currentModule.titulo}</h1>
          <p className="text-gray-600 mb-6">{currentModule.descripcion}</p>

          <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <ContenedorContenido
              tipo={tipoContenido}
              urlContenido={currentContentUrl}
              contenidoTexto={contenidoTexto}
            />
          </div>

          <Navegacion
            onNavigate={handleNavigation}
            disablePrev={disablePrev}
            disableNext={disableNext}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
}
