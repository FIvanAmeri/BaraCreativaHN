import React from "react";
import Card from "@/components/tarjetas/page";

const services = [
  {
    title: "PROYECTOS DE CAPACITACION EMPRESARIAL",
    image: "/foto-servicio.png",
    description: "Soluciones personalizadas para mejorar las habilidades de tu equipo.",
  },
  {
    title: "DESARROLLO DE PROYECTOS E-LEARNING BC",
    image: "/desarrollo-de-proyectos-e-learning-bc.png",
    description: "Asesoría para optimizar programas de aprendizaje y e-learning.",
  },
  {
    title: "COACHING EDUCATIVO BC",
    image: "/coaching-educativo-bc.png",
    description: "Creación de materiales educativos interactivos y de alto impacto.",
  },
];

const ThreeServicesSection: React.FC = () => {
  return (
    <section className="container mx-auto py-12 bg-[var(--background)] text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Servicios que Brindamos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {services.slice(0, 3).map((service) => (
          <Card
            key={service.title}
            title={service.title}
            image={service.image}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ThreeServicesSection;