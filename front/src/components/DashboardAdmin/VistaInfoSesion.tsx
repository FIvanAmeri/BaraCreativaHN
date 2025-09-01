'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import TablaInfoSesion from './TablaInfoSesion';
import FiltrosInfoSesion from './FiltrosInfoSesion';


const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

interface Usuario {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  tipoUsuario: string;
  nombreEmpresa?: string;
  estadoCuenta: string;
  estaConectado: boolean;
  esAdmin: boolean;
  ultimaSesion?: string;
  fotoPerfil?: string;
}

interface UserWithSessionData extends Usuario {
  duracionUltimaSesion?: number;
  duracionTotalConectado?: number;
}

const VistaInfoSesion: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UserWithSessionData[]>([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [correoFiltro, setCorreoFiltro] = useState('');
  const [cargando, setCargando] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const obtenerUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      const url = new URL(`${API_URL}/api/usuarios`);
      if (nombreFiltro) url.searchParams.append("nombre", nombreFiltro);
      if (correoFiltro) url.searchParams.append("correoElectronico", correoFiltro);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      const usuariosData: Usuario[] = await res.json();
      
      const usuariosConDatosSesion = await Promise.all(
        usuariosData.map(async (user) => {
          const [ultimaSesionRes, duracionTotalRes] = await Promise.all([
            fetch(`${API_URL}/api/sesion/ultima?usuarioId=${user.id}`, { credentials: "include" }),
            fetch(`${API_URL}/api/sesion/duracion-total?usuarioId=${user.id}`, { credentials: "include" })
          ]);
          
          const ultimaSesionData = ultimaSesionRes.ok ? await ultimaSesionRes.json() : {};
          const duracionTotalData = duracionTotalRes.ok ? await duracionTotalRes.json() : {};

          return {
            ...user,
            duracionUltimaSesion: ultimaSesionData.duracionSegundos,
            duracionTotalConectado: duracionTotalData.duracion,
          };
        })
      );
      setUsuarios(usuariosConDatosSesion);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setCargando(false);
    }
  }, [API_URL, nombreFiltro, correoFiltro]);

  const debouncedObtenerUsuarios = useRef(debounce(obtenerUsuarios, 500)).current;

  useEffect(() => {
    debouncedObtenerUsuarios();
  }, [nombreFiltro, correoFiltro, debouncedObtenerUsuarios]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración de Sesiones</h1>
      <FiltrosInfoSesion
        nombreFiltro={nombreFiltro}
        setNombreFiltro={setNombreFiltro}
        correoFiltro={correoFiltro}
        setCorreoFiltro={setCorreoFiltro}
      />
      {cargando ? (
        <div className="text-center mt-8">Cargando información de usuarios...</div>
      ) : (
        <TablaInfoSesion usuarios={usuarios} />
      )}
    </div>
  );
};

export default VistaInfoSesion;