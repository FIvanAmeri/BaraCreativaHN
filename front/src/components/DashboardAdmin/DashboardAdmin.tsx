import React, { useState } from 'react';
import MenuAdmin from './MenuAdmin';
import VistaCursos from './VistaCursos';
import VistaUsuarios from '@/components/DashboardAdmin/VistaUsuarios/VistaUsuarios';
import AgregarUsuario from '@/components/DashboardAdmin/AgregarUsuario/AgregarUsuario';
import VistaInfoSesion from './VistaInfoSesion';

export default function DashboardAdmin() {
  const [vistaSeleccionada, setVistaSeleccionada] = useState<'usuarios' | 'cursos' | 'agregarUsuario' | 'infoSesion'>('usuarios');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <MenuAdmin seleccionarVista={setVistaSeleccionada} />
      <main className="flex-1 p-6">
        {vistaSeleccionada === 'usuarios' && <VistaUsuarios />}
        {vistaSeleccionada === 'cursos' && <VistaCursos />}
        {vistaSeleccionada === 'agregarUsuario' && (
          <AgregarUsuario onUsuarioCreado={() => {}} />
        )}
        {vistaSeleccionada === 'infoSesion' && <VistaInfoSesion />}
      </main>
    </div>
  );
}