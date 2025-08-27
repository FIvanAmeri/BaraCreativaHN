'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PanelTarjeta } from '@/components/ScormID/PanelTarjeta';
import { ListaModulos } from '@/components/ScormID/ListaModulos';
import { SeccionPago } from '@/components/ScormID/SeccionPago';
import { useDatosCurso } from '@/app/hooks/ScormHooks/useDatosCurso';
import { Modulo } from '@/app/types/curso';

export default function CursoDetalle() {
  const router = useRouter();
  const { curso, loading, error, crearOrden, onApprove } = useDatosCurso();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  const handleModuleClick = (index: number) => {
    setCurrentModuleIndex(index);
  };

  const handlePayPalError = (err: unknown) => {
    console.error('Error general en PayPal desde el botón:', err);
    toast.error('Ocurrió un error con PayPal. Por favor, reintenta.');
  };

  if (loading) {
    return (
      <p className="text-center text-lg mt-8 text-text-light animate-pulse drop-shadow-cyber-glow-cyan">
        Cargando datos del programa...
      </p>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-8 p-6 bg-mid-dark-bg border border-border-glitch rounded-lg shadow-xl animate-fade-in-up relative overflow-hidden">
        <div className="absolute inset-0 bg-diagonal-scanline opacity-10 animate-glitch-subtle"></div>
        <p className="font-bold mb-3 text-2xl text-accent-magenta drop-shadow-cyber-glow-magenta">¡ERROR DETECTADO!</p>
        <p className="text-text-light text-base mb-4">{error}</p>
        <p className="mt-4 text-sm text-text-muted">Interferencia detectada. Reintenta la conexión o contacta al operador de soporte.</p>
      </div>
    );
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
  
  return (
    <div
      className="p-6 md:p-8 lg:p-12 bg-dark-bg
                  rounded-2xl shadow-xl text-text-light font-sans max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl
                  mx-auto my-8 md:my-12
                  relative overflow-hidden
                  border border-mid-dark-bg transition-colors duration-300 hover:border-accent-cyan"
    >
      <div className="absolute inset-0 z-0 opacity-[0.02] animate-pulse-light">
        <div className="h-full w-full bg-[size:40px_40px] bg-[linear-gradient(to_right,rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,255,0.02)_1px,transparent_1px)]"></div>
      </div>

      <h1
        className="mb-12 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta text-center
                   relative z-10 drop-shadow-cyber-glow-magenta animate-fade-in-up
                   cursor-default tracking-wider group"
      >
        {curso?.titulo}
        <span className="absolute left-1/2 -bottom-2 h-0.5 w-0 bg-gradient-to-r from-accent-cyan via-accent-lime to-accent-magenta opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-500 transform -translate-x-1/2 rounded-full"></span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-8 items-start relative z-10">

        <div className="flex flex-col gap-8 md:gap-10">
          {curso?.imagenCurso && typeof curso.imagenCurso === 'string' && (
            <div className="animate-fade-in-up animation-delay-[100ms]">
              <PanelTarjeta colorBordeHover="accent-cyan" claseAdicional="p-4 md:p-6" conEfectoBrilloImagen>
                <img
                  src={`${API_BASE_URL}/${curso.imagenCurso}`}
                  alt={`Imagen de ${curso.titulo}`}
                  className="max-w-full h-auto object-contain rounded-md shadow-md
                           border border-transparent group-hover:border-accent-magenta transition-all duration-300
                           image-hover-tilt max-h-96 w-full"
                />
              </PanelTarjeta>
            </div>
          )}

          <div className="animate-fade-in-up animation-delay-[200ms]">
            <PanelTarjeta titulo="Descripción:" colorBordeHover="accent-cyan" conEfectoEscaneo>
              <p className="text-text-light text-base sm:text-lg leading-relaxed opacity-90">{curso?.descripcion}</p>
            </PanelTarjeta>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-10">
          <div className="animate-fade-in-up animation-delay-[300ms]">
            <PanelTarjeta titulo="Detalles del Curso:" colorBordeHover="accent-cyan">
              <p className="font-bold text-base sm:text-lg text-accent-lime mb-3 group cursor-default">
                💲 Precio: <span className="text-text-light">${curso?.precio}</span>
                <span className="inline-block group-hover:animate-bounce-once origin-bottom ml-1"></span>
              </p>
              <div className="text-text-muted text-sm sm:text-base space-y-3">
                <p>
                  Certificado:{' '}
                  {curso?.certificadoDisponible ? (
                    <span className="text-accent-lime inline-flex items-center group cursor-help relative animate-pulse-light">
                      ✅ Disponible
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-dark-bg text-xs text-text-light px-2 py-1 rounded
                                         opacity-0 group-hover:opacity-100
                                         transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-accent-cyan
                                         group-hover:animate-tooltip-pop-in">
                        Obtén tu certificado al finalizar
                      </span>
                    </span>
                  ) : (
                    <span className="text-border-glitch animate-glitch-subtle">❌ No disponible</span>
                  )}
                </p>
                <p>
                  Badge:{' '}
                  {curso?.badgeDisponible ? (
                    <span className="text-accent-lime animate-pulse-light">✅ Disponible</span>
                  ) : (
                    <span className="text-border-glitch animate-glitch-subtle">❌ No disponible</span>
                  )}
                </p>
                <p>
                  Archivo Scorm:{' '}
                  {curso?.archivoScorm ? (
                    <span className="text-accent-lime animate-pulse-light">✅ Disponible</span>
                  ) : (
                    <span className="text-border-glitch animate-glitch-subtle">❌ No disponible</span>
                  )}
                </p>
                <p>Tipo: <span className="font-bold text-accent-cyan">{curso?.tipo}</span></p>
                <p>Categoría: <span className="font-bold text-accent-cyan">{curso?.categoria ?? 'Sin categoría'}</span></p>
                <p>Modalidad: <span className="font-bold text-accent-cyan">{curso?.modalidad}</span></p>
                <p>Horas: <span className="font-bold text-accent-cyan">{curso?.duracionHoras}</span></p>
              </div>
            </PanelTarjeta>
          </div>
          
          <div className="animate-fade-in-up animation-delay-[400ms]">
            <ListaModulos 
              modulos={curso?.modulos as Modulo[]} 
              currentModuleIndex={currentModuleIndex} 
              onModuleClick={handleModuleClick}
            />
          </div>
        </div>
      </div>
      
      <div className="animate-fade-in animation-delay-[500ms]">
        <SeccionPago
          crearOrden={crearOrden}
          onApprove={onApprove}
          onError={handlePayPalError}
        />
      </div>
    </div>
  );
}
