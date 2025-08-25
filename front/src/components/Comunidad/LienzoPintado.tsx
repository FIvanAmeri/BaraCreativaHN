"use client";

import { motion } from "framer-motion";

export const LienzoPintado = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        bottom: "50px", 
        width: "80%",
        height: "200px",
        backgroundColor: "rgba(100, 100, 100, 0.3)",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
    </motion.div>
  );
};