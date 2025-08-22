"use client";

import React from "react";
import VideoSlider from "./VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const Contenedor_2 = () => {
  return (
    <div className="w-full h-full flex flex-col rounded-lg bg-gray-200 p-4 gap-6">
      <VideoSlider />
      <div className="flex-1 flex">
        <ContenedorDeTestimonios />
      </div>
    </div>
  );
};

export default Contenedor_2;
