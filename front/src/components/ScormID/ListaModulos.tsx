"use client";

import { Modulo } from "@/app/types/curso";
import React from 'react';


export interface ListaModulosProps {
  modulos: Modulo[] | undefined;
  currentModuleIndex: number;
  onModuleClick: (index: number) => void;
}


export function ListaModulos({ modulos, currentModuleIndex, onModuleClick }: ListaModulosProps) {
  return (
    <div className="space-y-2 flex-grow overflow-y-auto pr-2">
      {modulos?.map((modulo, index) => (
        <button
          key={modulo.id}
          onClick={() => onModuleClick(index)}
          className={`w-full text-left p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out ${
          
            index === currentModuleIndex
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-800'
          }`}
        >
          <span className="font-semibold">{index + 1}. {modulo.titulo}</span>
        </button>
      ))}
    </div>
  );
}
