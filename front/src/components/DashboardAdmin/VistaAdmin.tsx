"use client";

import React, { useState } from "react";
import MenuAdmin from "@/components/DashboardAdmin/MenuAdmin";
import VistaUsuarios from "@/components/DashboardAdmin/VistaUsuarios/VistaUsuarios";
import VistaCursos from "@/components/DashboardAdmin/VistaCursos";
import AgregarUsuario from "@/components/DashboardAdmin/AgregarUsuario/AgregarUsuario";

const VistaAdmin: React.FC = () => {
  const [vista, setVista] = useState<"usuarios" | "cursos" | "agregarUsuario">("usuarios");

  const renderVista = () => {
    switch (vista) {
      case "usuarios":
        return <VistaUsuarios />;
      case "cursos":
        return <VistaCursos />;
      case "agregarUsuario":
        return <AgregarUsuario onUsuarioCreado={() => setVista("usuarios")} />;
      default:
        return <p>Seleccioná una opción del menú</p>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MenuAdmin seleccionarVista={setVista} />
      <main className="flex-1 bg-white p-4">{renderVista()}</main>
    </div>
  );
};

export default VistaAdmin;