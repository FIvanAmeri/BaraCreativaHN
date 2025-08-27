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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-cyan-400">
        <p className="text-xl animate-pulse drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]">
          Cargando curso y módulos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-center">
        <div className="p-8 border border-red-500 rounded-lg shadow-xl animate-fade-in-up bg-mid-dark-bg text-gray-200">
          <h2 className="text-2xl font-bold text-red-400 drop-shadow-cyber-glow-magenta">¡ERROR DETECTADO!</h2>
          <p className="mt-4 text-base font-mono text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-gray-200">
        <p className="text-lg animate-pulse-light">No hay contenido disponible para este curso.</p>
      </div>
    );
  }

  if (!currentModule) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-gray-200">
        <p className="text-lg animate-pulse-light">No hay contenido disponible para este módulo.</p>
      </div>
    );
  }

  const tipoContenido = currentModule.tipo !== null ? currentModule.tipo : 'texto';
  const contenidoTexto = currentModule.tipo === 'texto' ? currentModule.descripcion : undefined;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen bg-dark-bg p-4 gap-4 font-sans text-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.02] animate-pulse-light">
          <div className="h-full w-full bg-[size:40px_40px] bg-[linear-gradient(to_right,rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,255,0.02)_1px,transparent_1px)]"></div>
        </div>
        <div className="relative z-10 lg:w-1/4 bg-mid-dark-bg border border-border-glitch rounded-lg shadow-xl p-6 flex flex-col overflow-hidden animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400 drop-shadow-cyber-glow-cyan">Módulos del Curso</h2>
          <BarraProgreso progreso={progresoGeneral} />
          <ListaModulos
            modulos={modulosEstadoUsuario}
            currentModuleIndex={currentModuleIndex}
            onModuleClick={handleModuleClick}
          />
        </div>

        <div className="relative z-10 lg:w-3/4 bg-mid-dark-bg border border-border-glitch rounded-lg shadow-xl p-6 flex flex-col animate-fade-in-up animation-delay-[100ms]">
          <MensajeFinal mostrar={cursoCompletadoGeneral} />

          <h1 className="text-3xl font-bold mb-4 text-fuchsia-400 drop-shadow-cyber-glow-magenta">{currentModule.titulo}</h1>
          <p className="text-gray-400 mb-6">{currentModule.descripcion}</p>

          <div className="flex-grow flex items-center justify-center bg-dark-bg rounded-lg overflow-hidden border border-border-glitch">
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
