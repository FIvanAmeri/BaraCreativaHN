"use client";

import { useState, useEffect } from "react";
import { usarNavegacionDeVideo } from "../../app/hooks/usarNavegacionDeVideo";
import { videosDeTestimonios } from "../../app/testimonios/videosDeTestimonios";
import { VideoActivo } from "./VideoActivo";

const BotonNavegacion = ({
  direccion,
  onClick,
}: {
  direccion: "izquierda" | "derecha";
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 ${
      direccion === "izquierda" ? "left-3" : "right-3"
    } bg-white rounded-full shadow-md w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:scale-110 transition z-30`}
    aria-label={`Ir ${direccion === "izquierda" ? "anterior" : "siguiente"}`}
  >
    <span className="text-xl sm:text-2xl font-bold text-gray-700">
      {direccion === "izquierda" ? "←" : "→"}
    </span>
  </button>
);

const VideoSlider = () => {
  const { indiceActual, videoSiguiente, videoAnterior } = usarNavegacionDeVideo(
    videosDeTestimonios.length
  );
  const [estaReproduciendo, setEstaReproduciendo] = useState(false);

  useEffect(() => {
    setEstaReproduciendo(false);
  }, [indiceActual]);

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full text-center py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-white font-semibold rounded-t-lg select-none text-lg sm:text-xl">
        {videosDeTestimonios[indiceActual].name}
      </div>


      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        {videosDeTestimonios.map(
          ({ src }, index) =>
            index === indiceActual && (
              <div key={src} className="absolute inset-0">
                <VideoActivo
                  src={src}
                  reproduciendo={estaReproduciendo}
                  onPlay={() => setEstaReproduciendo(true)}
                  onPause={() => setEstaReproduciendo(false)}
                />
              </div>
            )
        )}

        <BotonNavegacion
          direccion="izquierda"
          onClick={() => {
            videoAnterior();
            setEstaReproduciendo(false);
          }}
        />
        <BotonNavegacion
          direccion="derecha"
          onClick={() => {
            videoSiguiente();
            setEstaReproduciendo(false);
          }}
        />
      </div>
    </div>
  );
};

export default VideoSlider;
