"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const HeavyComponent = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-200 rounded-lg p-4 flex flex-col gap-6 overflow-y-auto min-h-[80vh]">
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
