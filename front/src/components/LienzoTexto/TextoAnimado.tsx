"use client";

import { motion } from "framer-motion";

interface TextoAnimadoProps {
  texto: string;
}

export const TextoAnimado = ({ texto }: TextoAnimadoProps) => (
  <motion.p
    className="max-w-full break-words"
    style={{ transform: "translateY(-50px)" }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.5 }}
  >
    {texto}
  </motion.p>
);