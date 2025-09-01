'use client';

import React from 'react';

interface Props {
  nombreFiltro: string;
  setNombreFiltro: (valor: string) => void;
  correoFiltro: string;
  setCorreoFiltro: (valor: string) => void;
}

export default function FiltrosInfoSesion({
  nombreFiltro,
  setNombreFiltro,
  correoFiltro,
  setCorreoFiltro,
}: Props) {
  return (
    <div className="mb-4 flex gap-3 flex-wrap">
      <input
        type="text"
        placeholder="Filtrar por nombre"
        value={nombreFiltro}
        onChange={(e) => setNombreFiltro(e.target.value)}
        className="px-4 py-2 rounded border border-gray-300 flex-grow"
      />
      <input
        type="text"
        placeholder="Filtrar por correo"
        value={correoFiltro}
        onChange={(e) => setCorreoFiltro(e.target.value)}
        className="px-4 py-2 rounded border border-gray-300 flex-grow"
      />
    </div>
  );
}