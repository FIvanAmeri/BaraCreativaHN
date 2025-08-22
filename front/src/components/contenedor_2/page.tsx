"use client";

import React from "react";
import VideoSlider from "@/components/contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "@/components/contenedor_2/contenedorDeTestimonios";
import { useTamanoPantalla } from '@/app/hooks/testimonios/useTamanoPantalla';

const HeavyComponent = () => {
  const tamanoPantalla = useTamanoPantalla();

  return (
    <div
      className="w-full bg-gray-200 rounded-lg p-2 sm:p-4 flex flex-col items-center gap-4 sm:gap-6"
    >
      <div className="w-full">
        <VideoSlider />
      </div>

      <div className="w-full">
        <ContenedorDeTestimonios />
      </div>
    </div>
  );
};

export default HeavyComponent;