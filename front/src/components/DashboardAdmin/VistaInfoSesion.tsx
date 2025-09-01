'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TablaInfoSesion from './TablaInfoSesion';
import FiltrosInfoSesion from './FiltrosInfoSesion';
import { Usuario } from '@/app/types/auth';

interface UserWithSessionData extends Usuario {
  duracionUltimaSesion?: number;
  duracionTotalConectado?: number;
}

const VistaInfoSesion: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UserWithSessionData[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UserWithSessionData[]>([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [correoFiltro, setCorreoFiltro] = useState('');
  const [cargando, setCargando] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  
  useEffect(() => {
    const obtenerTodosLosUsuarios = async () => {
      setCargando(true);
      try {
        const url = new URL(`${API_URL}/api/auth/admin/users-with-session-info`);
        const res = await fetch(url.toString(), { credentials: 'include' });

        if (!res.ok) {
          throw new Error('Error al obtener usuarios');
        }
        
        const usuariosData: UserWithSessionData[] = await res.json();
        setUsuarios(usuariosData);
        setUsuariosFiltrados(usuariosData);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerTodosLosUsuarios();
  }, [API_URL]);

  useEffect(() => {
    const filtroNombre = nombreFiltro.toLowerCase();
    const filtroCorreo = correoFiltro.toLowerCase();

    const nuevaLista = usuarios.filter((u) => {
      const nombreCoincide = u.nombreCompleto?.toLowerCase().includes(filtroNombre) || false;
      const correoCoincide = u.correoElectronico?.toLowerCase().includes(filtroCorreo) || false;
      return nombreCoincide && correoCoincide;
    });

    setUsuariosFiltrados(nuevaLista);
  }, [usuarios, nombreFiltro, correoFiltro]);

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
        <TablaInfoSesion usuarios={usuariosFiltrados} />
      )}
    </div>
  );
};

export default VistaInfoSesion;
