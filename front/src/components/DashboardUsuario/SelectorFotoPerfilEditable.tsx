'use client';

import Image from "next/image";
import React, { useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

interface Props {
  fotoPerfilInicial: string | null;
  editable: boolean;
  onFotoChange: (file: File | null) => void;
}

export default function SelectorFotoPerfilEditable({
  fotoPerfilInicial,
  editable,
  onFotoChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const manejarClick = () => {
    if (editable) {
      inputRef.current?.click();
    }
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFotoChange(e.target.files[0]);
    } else {
      onFotoChange(null);
    }
  };

  return (
    <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-gray-600 shadow-xl group cursor-pointer transition-all duration-300 transform hover:scale-105" onClick={manejarClick}>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={manejarCambio}
        accept="image/*"
        disabled={!editable}
      />
      
      {fotoPerfilInicial ? (
        <img
          src={fotoPerfilInicial}
          alt="Foto de Perfil"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
          <FaUserCircle className="w-2/3 h-2/3" />
        </div>
      )}

      {editable && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <MdEdit className="text-white text-3xl" />
        </div>
      )}
    </div>
  );
}
