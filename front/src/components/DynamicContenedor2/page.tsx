"use client";

import dynamic from "next/dynamic";


const Contenedor_2 = dynamic(() => import("./page"), {
  loading: () => <p>Cargando contenido pesado...</p>,
  ssr: false,
});

const DynamicContenedor2: React.FC = () => {
  return <Contenedor_2 />;
};

export default DynamicContenedor2;
