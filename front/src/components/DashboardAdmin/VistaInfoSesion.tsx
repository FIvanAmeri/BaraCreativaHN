'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import TablaInfoSesion from './TablaInfoSesion';
import FiltrosInfoSesion from './FiltrosInfoSesion';
import { Usuario, TipoUsuario } from '@/app/types/auth';

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

interface UserWithSessionData extends Usuario {
  duracionUltimaSesion?: number;
  duracionTotalConectado?: number;
}

const VistaInfoSesion: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UserWithSessionData[]>([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [correoFiltro, setCorreoFiltro] = useState('');
  const [cargando, setCargando] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const obtenerUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      const url = new URL(`${API_URL}/api/auth/admin/users-with-session-info`);
      if (nombreFiltro) url.searchParams.append('nombre', nombreFiltro);
      if (correoFiltro) url.searchParams.append('correoElectronico', correoFiltro);

      const res = await fetch(url.toString(), { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const usuariosData: UserWithSessionData[] = await res.json();
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
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
