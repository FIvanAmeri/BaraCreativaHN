'use client';

import React from 'react';

interface Props {
  filtro: 'todos' | 'conectados' | 'desconectados';
  setFiltro: (valor: 'todos' | 'conectados' | 'desconectados') => void;
  cantidadTotal: number;
  cantidadConectados: number;
  cantidadDesconectados: number;
}

export default function FiltrosUsuarios({
  filtro,
  setFiltro,
  cantidadTotal,
  cantidadConectados,
  cantidadDesconectados
}: Props) {
  return (
    <div className="mb-4 flex gap-3 overflow-x-auto flex-nowrap">
      <button
        onClick={() => setFiltro('todos')}
        className={`px-4 py-1 rounded font-semibold transition flex-shrink-0 ${
          filtro === 'todos'
            ? 'bg-black text-red-400 ring-2 ring-red-400 shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-red-200'
        }`}
      >
        Todos ({cantidadTotal})
      </button>

      <button
        onClick={() => setFiltro('conectados')}
        className={`px-4 py-1 rounded font-semibold transition flex-shrink-0 ${
          filtro === 'conectados'
            ? 'bg-black text-red-400 ring-2 ring-red-400 shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-red-200'
        }`}
      >
        Conectados ({cantidadConectados})
      </button>

      <button
        onClick={() => setFiltro('desconectados')}
        className={`px-4 py-1 rounded font-semibold transition flex-shrink-0 ${
          filtro === 'desconectados'
            ? 'bg-black text-red-400 ring-2 ring-red-400 shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-red-200'
        }`}
      >
        Desconectados ({cantidadDesconectados})
      </button>
    </div>
  );
}