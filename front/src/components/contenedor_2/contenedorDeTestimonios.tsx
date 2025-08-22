"use client";

import { useEffect, useState } from "react";
import { testimoniosDeUsuarios } from "../../app/testimonios/testimoniosDeUsuarios";
import { motion, AnimatePresence } from "framer-motion";

const ContenedorDeTestimonios = () => {
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % testimoniosDeUsuarios.length);
    }, 8000);
    return () => clearInterval(intervalo);
  }, []);

  const testimonio = testimoniosDeUsuarios[indiceActual];

  return (
    <div className="relative w-full max-w-3xl mx-auto flex items-center justify-center px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={indiceActual}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
          className="flex bg-orange-100 text-orange-900 rounded-lg shadow-lg p-4 gap-4 w-full"
        >
          <img
            src={testimonio.imagen}
            alt={testimonio.nombre}
            className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover rounded-full border-2 border-orange-300 flex-shrink-0"
          />
          <div className="flex flex-col justify-center overflow-hidden">
            <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{testimonio.nombre}</h3>
            <p className="text-sm sm:text-base whitespace-pre-line break-words">
              {testimonio.mensaje}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ContenedorDeTestimonios;
