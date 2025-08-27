'use client';

import React, { useState } from 'react';
import OpcionesAsistencia from './OpcionesAsistencia';
import Image from 'next/image';

const WhatsApp: React.FC = () => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const alternarOpciones = () => setMostrarOpciones(!mostrarOpciones);

  return (
    <div className="fixed bottom-2 left-2 flex flex-col items-start z-50">
      <OpcionesAsistencia visible={mostrarOpciones} />
      <button
        onClick={alternarOpciones}
        className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px]"
      >
        <Image
          src="/logo-wsp.png"
          alt="Logo de WhatsApp"
          width={70}
          height={70}
          className="w-full h-full object-contain"
        />
      </button>
    </div>
  );
};

export default WhatsApp;
