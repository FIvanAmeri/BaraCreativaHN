"use client";

import PhotoCarousel from "@/components/slice/page";
import Contenedor_1 from "@/components/contenedor_1/page";
import DynamicContenedor2 from "@/components/DynamicContenedor2/page";
import LogoSlider from "@/components/logoSlider/page";
import ThreeCoursesSection from "@/components/cursos-principales/page";
import ThreeServicesSection from "@/components/servicios-pricipales/page";
import Introduction from "@/components/introduccion/page";

export default function Home() {
  return (
    <div className="bg-[var(--background)] font-sans text-white">
      {/* Carrusel de fotos */}
      <div>
        <PhotoCarousel />
      </div>

      {/* Sección de bienvenida */}
      <section className="container mx-auto py-8 border border-white rounded-xl my-4">
        <h1 className="text-3xl font-bold text-center">
          Bienvenidos a Bara Creativa
        </h1>
        <p className="text-center mt-4">
          Edtech hondureña que ofrece cursos e-learning y presenciales de alto
          impacto.
        </p>
      </section>

      {/* Sección de los dos contenedores */}
      <section className="container mx-auto py-8 flex flex-col md:flex-row gap-4 items-stretch">
        <div className="w-full md:w-1/2 flex">
          <Contenedor_1 />
        </div>
        <div className="w-full md:w-1/2 flex">
          <DynamicContenedor2 />
        </div>
      </section>

      {/* Carrusel de marcas */}
      <div>
        <LogoSlider />
      </div>

      {/* Sección de tres cursos */}
      <div className="border border-white rounded-xl my-4">
        <ThreeCoursesSection />
      </div>

      {/* Sección de tres servicios */}
      <div className="border border-white rounded-xl my-4">
        <ThreeServicesSection />
      </div>

      {/* Sección de presentación personal */}
      <div className="border border-white rounded-xl my-4">
        <Introduction />
      </div>
    </div>
  );
}
