"use client";

import React from "react";
import SobreComunidadButton from "../Botones/sobre-nosotros";
import ComunidadButton from "../Botones/comunidad";
import Academias from "../Botones/academias";
import Cursos from "../Botones/cursos";
import Contactenos from "../Botones/contactenos";
import BotonConEfecto from "../Botones/BotonConEfecto";
import BarraBusqueda from "../BarraBusqueda/barrabusqueda";
import MobileMenuItem from "./MobileMenuItem";
import { useAuth } from "@/app/context/AuthContext";

interface MobileMenuNavProps {
  onClose: () => void;
}

const MobileMenuNav: React.FC<MobileMenuNavProps> = ({ onClose }) => {
  const { usuario, cargandoUsuario } = useAuth();

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <MobileMenuItem onClick={onClose}>
          <SobreComunidadButton />
        </MobileMenuItem>

        {!usuario && !cargandoUsuario && (
          <MobileMenuItem onClick={onClose}>
            <BotonConEfecto texto="Acceso" href="/login" />
          </MobileMenuItem>
        )}

     
        <MobileMenuItem onClick={onClose}>
          <ComunidadButton />
        </MobileMenuItem>
        <MobileMenuItem onClick={onClose}>
          <Academias />
        </MobileMenuItem>

 
        <MobileMenuItem onClick={onClose}>
          <Cursos />
        </MobileMenuItem>
        <MobileMenuItem onClick={onClose}>
          <Contactenos />
        </MobileMenuItem>
      </div>


      <BarraBusqueda className="w-full max-w-sm" />
    </div>
  );
};

export default MobileMenuNav;
