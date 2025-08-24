"use client";

import React from "react";
import SobreComunidadButton from "../Botones/sobre-nosotros";
import ComunidadButton from "../Botones/comunidad";
import Academias from "../Botones/academias";
import Cursos from "../Botones/cursos";
import Contactenos from "../Botones/contactenos";
import MobileMenuItem from "./MobileMenuItem";

interface MobileMenuNavProps {
  onClose: () => void;
}

const MobileMenuNav: React.FC<MobileMenuNavProps> = ({ onClose }) => {
  return (
    <>
      <MobileMenuItem onClick={onClose}>
        <SobreComunidadButton />
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
    </>
  );
};

export default MobileMenuNav;
