"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UsuarioAutenticado {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  telefono?: string;
  tipoUsuario?: string;
  nombreEmpresa?: string;
  fotoPerfil?: string;
  estadoCuenta?: string;
  esAdmin: boolean;
  creadoEn: string;
  actualizadoEn: string;
  ultimaSesion?: string;
}

export const useAutenticacion = () => {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const obtenerDatosUsuario = useCallback(async (): Promise<UsuarioAutenticado | null> => {
    try {
      const respuesta = await fetch(`${API_URL}/api/auth/profile`, {
        method: "GET",
        credentials: "include",
      });

      if (!respuesta.ok) {
        // En tu lógica actual, si el token no es válido o expiró, el backend
        // no devuelve la información y el cliente no la puede obtener.
        // Aquí no hace falta limpiar localStorage ya que la autenticación es por cookies.
        if (respuesta.status === 401) {
          console.log("¿Que esperas para unirte a Bara Creativa?.");
        } else if (respuesta.status === 404) {
          console.error("Error 404: La ruta del perfil no se encontró. Revisa tu backend.");
        } else {
          console.error(`Error inesperado al obtener perfil: ${respuesta.status}`);
        }
        setUsuario(null);
        return null;
      }

      const contentType = respuesta.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Error: La respuesta no es JSON. Se recibió:", await respuesta.text());
        setUsuario(null);
        return null;
      }

      const userData: UsuarioAutenticado = await respuesta.json();
      return userData;
    } catch (error) {
      console.error("Error de conexión al intentar obtener el perfil:", error);
      setUsuario(null);
      return null;
    }
  }, [API_URL]);

  const manejarInicioSesion = async (
    e: React.FormEvent,
    correo: string,
    contrasena: string
  ): Promise<boolean> => {
    e.preventDefault();

    try {
      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          correoElectronico: correo,
          password: contrasena,
        }),
      });

      if (!respuesta.ok) {
        const contentType = respuesta.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await respuesta.json();
          console.error(errorData.message || "Error al iniciar sesión");
        } else {
          console.error("Error al iniciar sesión. La respuesta no es JSON.");
          console.log("Respuesta del servidor:", await respuesta.text());
        }
        return false;
      }

      const { sesionId } = await respuesta.json();
      localStorage.setItem("sesionId", sesionId);

      const usuarioLogeado = await obtenerDatosUsuario();

      if (usuarioLogeado) {
        setUsuario(usuarioLogeado);
        setMensajeExito(true);
        router.push("/");
        return true;
      } else {
        console.error("Inicio de sesión exitoso, pero no se pudo obtener el perfil.");
        return false;
      }
    } catch (error) {
      console.error("Error al conectar con el servidor o iniciar sesión.", error);
      return false;
    }
  };

  const cerrarSesion = useCallback(async () => {
    const sesionId = localStorage.getItem("sesionId");
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sesionId: sesionId }),
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("sesionId");
      setUsuario(null);
      setMensajeExito(false);
      router.push("/login");
      router.refresh();
    }
  }, [router, API_URL]);

  useEffect(() => {
    const loadUser = async () => {
      setCargandoUsuario(true);
      const user = await obtenerDatosUsuario();
      setUsuario(user);
      setCargandoUsuario(false);
    };

    loadUser();
  }, [obtenerDatosUsuario]);

  return {
    usuario,
    cargandoUsuario,
    mensajeExito,
    setMensajeExito,
    manejarInicioSesion,
    cerrarSesion,
  };
};