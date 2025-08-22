"use client";

import React from "react";
import clsx from "clsx";

interface Contenedor1Props {
  bgColor?: string;
  children?: React.ReactNode;
  className?: string;
}

const Contenedor_1: React.FC<Contenedor1Props> = ({
  bgColor = "bg-gray-200",
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "w-full h-full flex flex-col rounded-lg p-3 sm:p-4",
        bgColor,
        className
      )}
    >
      {children ? (
        children
      ) : (
        <div className="p-3 sm:p-6 w-full h-full flex flex-col">
          <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-blue-800">
            ¿Por qué elegirnos?
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 xl:gap-6 items-start flex-1">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-xl sm:text-2xl">🎮</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Capacitaciones que no aburren
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600 mt-1">
                  Cursos interactivos donde cada lección se siente como un
                  desafío superado.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-xl sm:text-2xl">📊</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Resultados medibles
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600 mt-1">
                  Analizamos datos en tiempo real para ajustar el aprendizaje a
                  tus necesidades.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-xl sm:text-2xl">🖥️</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Tecnología accesible
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600 mt-1">
                  Plataforma intuitiva que reduce la curva de aprendizaje para
                  docentes y empresas.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-xl sm:text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Productividad inmediata
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600 mt-1">
                  Microlecciones aplicables desde el primer día, optimizando
                  tiempo y recursos.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow xl:col-span-2">
              <span className="text-xl sm:text-2xl">🌟</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Bienestar educativo
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600 mt-1">
                  Dinámicas que reducen el estrés y motivan a equipos y
                  profesores.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-6 bg-blue-100 text-blue-800 rounded-lg py-2 sm:py-3 px-3 text-center italic font-medium text-[0.65rem] sm:text-base">
            En Bara Creativa no solo aprendes: jugás, creces y transformas tu
            realidad.
          </div>
        </div>
      )}
    </div>
  );
};

export default Contenedor_1;
