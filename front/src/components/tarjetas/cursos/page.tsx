"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Curso } from '@/app/types/curso';

interface CardsListProps {
  cursos: Curso[];
}

export default function CardsList({ cursos }: CardsListProps) {
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!cursos || cursos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
      {cursos.map((curso) => {
        const urlImagen = curso.imagenCurso
          ? `${backendBaseUrl}/uploads/imagenes-cursos/${curso.imagenCurso}`
          : 'https://placehold.co/400x200/cccccc/333333?text=Sin+Imagen';

        return (
          <Link href={`/cursos/${curso.id}`} key={curso.id} className="block">
            <div className="border rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              {curso.imagenCurso ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={urlImagen}
                    alt={curso.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-[var(--primary)] line-clamp-2">{curso.titulo}</h3>
                <p className="text-gray-700 text-sm flex-grow line-clamp-3">{curso.descripcion}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}