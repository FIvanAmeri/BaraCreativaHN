"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const BotonAnimado = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.25 }}
  >
    <Link
      href="/registro"
      className="inline-block bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
    >
      ¡Quiero ser parte!
    </Link>
  </motion.div>
);