'use client';

import React, { useState } from "react";
import { Usuario } from "@/app/types/auth";
import SelectorFotoPerfilEditable from "./SelectorFotoPerfilEditable";
import InputFlotante from "./InputFlotante";
import InfoCuenta from "./InfoCuenta";
import BotonesEdicion from "./BotonesEdicion";
import MensajeError from "./MensajeError";
import { usePerfilEditable } from "../../app/hooks/perfil/usePerfilEditable";
import InlineToast from "./InlineToast";

interface Props {
  usuario: Usuario;
  onActualizar: (usuarioActualizado: Usuario) => void;
}

export default function PerfilUsuarioEditable({ usuario, onActualizar }: Props) {
  const {
    telefono,
    setTelefono,
    fotoPerfil,
    setFotoPerfil,
    previewFoto,
    setPreviewFoto,
    guardando,
    setGuardando,
    error,
    setError,
    editando,
    setEditando,
    estadoInicial,
    setEstadoInicial,
  } = usePerfilEditable(usuario);

  const nombreCompleto = usuario.nombreCompleto;
  const [mensajeExito, setMensajeExito] = useState("");

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const manejarCambioFoto = (file: File | null) => {
    if (editando) setFotoPerfil(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewFoto(estadoInicial.fotoPerfilUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editando) {
      setEstadoInicial({ telefono, fotoPerfilUrl: previewFoto });
      setEditando(true);
      return;
    }

    if (!backendBaseUrl) {
      setError("Error: URL del backend no configurada.");
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("telefono", telefono);
      
      if (fotoPerfil) {
        formData.append("fotoPerfil", fotoPerfil);
      }

      const res = await fetch(`${backendBaseUrl}/usuarios/${usuario.id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al actualizar");
      }

      const usuarioActualizado = await res.json();
      onActualizar(usuarioActualizado);
      setMensajeExito("✅ Perfil actualizado exitosamente 🚀");
      setEditando(false);
      setFotoPerfil(null); 
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError("Error desconocido");
    } finally {
      setGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    setTelefono(estadoInicial.telefono);
    setFotoPerfil(null);
    setPreviewFoto(estadoInicial.fotoPerfilUrl);
    setEditando(false);
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl shadow-yellow-400/30 ring-1 ring-yellow-400/20 space-y-6 font-sans text-white select-none"
    >
      <h1 className="text-3xl font-extrabold text-center tracking-wide mb-4 drop-shadow-[0_0_10px_rgba(255,255,200,0.7)]">
        Bienvenido, {nombreCompleto}
      </h1>

      <SelectorFotoPerfilEditable
        fotoPerfilInicial={previewFoto}
        editable={editando}
        onFotoChange={manejarCambioFoto}
      />

      <InputFlotante
        id="nombreCompleto"
        label="Nombre Completo"
        value={nombreCompleto}
        disabled
      />

      <InputFlotante
        id="correoElectronico"
        label="Correo Electrónico"
        value={usuario.correoElectronico}
        type="email"
        disabled
      />

      <InputFlotante
        id="telefono"
        label="Teléfono"
        value={telefono}
        disabled={!editando}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <InfoCuenta usuario={usuario} />

      <MensajeError mensaje={error} />

      <BotonesEdicion
        editando={editando}
        guardando={guardando}
        onCancelar={cancelarEdicion}
      />

      {mensajeExito && (
        <InlineToast mensaje={mensajeExito} onClose={() => setMensajeExito("")} />
      )}
    </form>
  );
}
