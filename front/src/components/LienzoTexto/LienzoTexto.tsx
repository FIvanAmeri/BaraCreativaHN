"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { TextoAnimado } from "./TextoAnimado";
import { BotonAnimado } from "./BotonAnimado";
import { useMostrar } from "@/app/hooks/useMostrar";
import { ContenedorFijoCentrado } from "./ContenedorFijoCentrado";
import { ContenedorAnimado } from "./ContenedorAnimado";

export const LienzoTexto = () => {
  const visible = useMostrar(1750);

  const texto = `¡Únete a la Comunidad Bara! Recibe recursos gratis, newsletter con tips disruptivos e invitación a eventos exclusivos. ¡Y accede a nuestro Telegram de profes y empresas innovadoras!`;

  return (
    <ContenedorFijoCentrado>
      <AnimatePresence>
        {visible && (
          <ContenedorAnimado>
            <TextoAnimado texto={texto} />
            <BotonAnimado />
          </ContenedorAnimado>
        )}
      </AnimatePresence>
    </ContenedorFijoCentrado>
  );
};
