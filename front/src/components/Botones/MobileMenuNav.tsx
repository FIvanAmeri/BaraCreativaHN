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

interface MobileMenuNavProps {
  onClose: () => void;
}

const MobileMenuNav: React.FC<MobileMenuNavProps> = ({ onClose }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
      <MobileMenuItem onClick={onClose}>
        <SobreComunidadButton />
      </MobileMenuItem>
      <MobileMenuItem onClick={onClose}>
        <BotonConEfecto texto="Acceso" href="/login" className="w-full" />
      </MobileMenuItem>

 
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

   
      <div className="col-span-2">
        <BarraBusqueda className="w-full" />
      </div>
    </div>
  );
};

export default MobileMenuNav;
