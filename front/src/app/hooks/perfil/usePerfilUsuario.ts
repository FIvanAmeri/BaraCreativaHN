"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Usuario } from "@/app/types/auth";

export const usePerfilUsuario = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    const obtenerPerfil = async () => {
      setCargando(true);
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setMensajeError("No autorizado. Debes iniciar sesión para acceder.");
          timeoutRef.current = setTimeout(() => router.push("/login"), 4000);
          return;
        }

        const data: Usuario = await res.json();
        setUsuario(data);
        setMensajeError(null);
      } catch {
        setMensajeError("Error desconocido al obtener perfil.");
        timeoutRef.current = setTimeout(() => router.push("/login"), 4000);
      } finally {
        setCargando(false);
      }
    };

    obtenerPerfil();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [API_URL, router]);

  return { usuario, setUsuario, mensajeError, cargando };
};