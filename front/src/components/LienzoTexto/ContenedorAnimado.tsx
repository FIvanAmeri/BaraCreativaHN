import React from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export const ContenedorAnimado: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-6 text-center text-white font-bold text-lg md:text-2xl whitespace-normal pointer-events-auto"
      style={{
        height: "100%",
        lineHeight: 1.5,
        textShadow: "0 0 5px rgba(0,0,0,0.8)",
        fontFamily: "'Sansation', sans-serif",
        overflowWrap: "normal",
        wordBreak: "normal",
        hyphens: "auto",
        marginTop: "-20px",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
