import { useState } from "react";
import { Usuario } from "@/app/types/auth";

export function usePerfilEditable(usuario: Usuario) {
  const [telefono, setTelefono] = useState(usuario.telefono || "");
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | undefined>(
    usuario.fotoPerfil
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/perfiles/${usuario.fotoPerfil}`
      : undefined
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  const [estadoInicial, setEstadoInicial] = useState({
    telefono: usuario.telefono || "",
    fotoPerfilUrl: previewFoto,
  });

  return {
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
  };
}