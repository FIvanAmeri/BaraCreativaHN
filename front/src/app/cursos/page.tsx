'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PanelTarjeta } from '@/components/ScormID/PanelTarjeta';
import { Curso, ClaseItem, TipoCurso } from '@/app/types/curso';

interface CatalogoCursosProps {
  cursos: Curso[];
}

export const CatalogoCursos: React.FC<CatalogoCursosProps> = ({ cursos }) => {
  const [filtro, setFiltro] = useState<'Todos' | ClaseItem>('Todos');

  const handleFiltroChange = (nuevoFiltro: 'Todos' | ClaseItem) => {
    setFiltro(nuevoFiltro);
  };


  const cursosFiltrados = cursos.filter((curso) => {
    if (filtro === 'Todos') {
      return true;
    }
    return curso.claseItem === filtro;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => handleFiltroChange('Todos')}
          className={`py-2 px-6 rounded-full font-bold transition-colors duration-300 ${
            filtro === 'Todos' ? 'bg-accent-magenta text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => handleFiltroChange(ClaseItem.CURSO)}
          className={`py-2 px-6 rounded-full font-bold transition-colors duration-300 ${
            filtro === ClaseItem.CURSO ? 'bg-accent-cyan text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Cursos
        </button>
        <button
          onClick={() => handleFiltroChange(ClaseItem.SERVICIO)}
          className={`py-2 px-6 rounded-full font-bold transition-colors duration-300 ${
            filtro === ClaseItem.SERVICIO ? 'bg-accent-lime text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Servicios
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {cursosFiltrados.map((curso) => (
          <PanelTarjeta key={curso.id} colorBordeHover="accent-cyan" claseAdicional="p-4 md:p-6" conEfectoBrilloImagen>
            <div className="flex flex-col items-center">
              <div className="w-full h-48 mb-4 rounded-md shadow-md border border-transparent flex items-center justify-center bg-mid-dark-bg">
                {curso.imagenCurso && (
                  <img
                    src={curso.imagenCurso}
                    alt={`Imagen de ${curso.titulo}`}
                    className="w-full h-full object-contain p-2 group-hover:border-accent-magenta transition-all duration-300"
                  />
                )}
              </div>
              <div className="text-sm font-semibold text-text-muted mb-2">
                {curso.claseItem.toUpperCase()} | {curso.tipo}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-accent-cyan mb-2 drop-shadow-cyber-glow-cyan">
                {curso.titulo}
              </h3>
              <p className="text-text-muted text-sm sm:text-base text-center mb-4">{curso.descripcion}</p>
              <p className="font-bold text-lg text-accent-lime mb-4">
                💲 Precio: <span className="text-text-light">${curso.precio}</span>
              </p>
              <Link href={`/cursos/${curso.id}`}>
                <button className="relative px-6 py-3 font-bold text-lg text-text-light rounded-lg overflow-hidden border-2 border-accent-magenta transition-all duration-300 hover:border-accent-cyan focus:outline-none group">
                  <span className="relative z-10">VER DETALLES</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </button>
              </Link>
            </div>
          </PanelTarjeta>
        ))}
      </div>
    </div>
  );
};
