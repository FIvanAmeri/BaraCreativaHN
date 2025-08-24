"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BotonConEfecto from "../Botones/BotonConEfecto";

interface MobileMenuUserProps {
  isProfileOpen: boolean;
  toggleProfileMenu: () => void;
  setIsProfileOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
}

const MobileMenuUser: React.FC<MobileMenuUserProps> = ({
  isProfileOpen,
  toggleProfileMenu,
  setIsProfileOpen,
  setIsMenuOpen,
  profileMenuRef,
}) => {
  const router = useRouter();
  const { usuario, cargandoUsuario, cerrarSesion } = useAuth();

  const getProfileImageUrl = (fotoPerfil: string | null | undefined) => {
    if (!fotoPerfil) return null;
    if (fotoPerfil.startsWith("http") || fotoPerfil.startsWith("/")) {
      return fotoPerfil;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/perfiles/${fotoPerfil}`;
  };

  const profileImageUrl = usuario ? getProfileImageUrl(usuario.fotoPerfil) : null;

  if (cargandoUsuario) {
    return (
      <div className="px-4 py-2 rounded-lg font-medium text-white bg-gray-400 animate-pulse whitespace-nowrap w-full max-w-sm text-center">
        Cargando...
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="w-full max-w-sm" onClick={() => setIsMenuOpen(false)}>
        <BotonConEfecto texto="Acceso" href="/login" className="w-full" />
      </div>
    );
  }

  return (
    <div
      className="relative z-[60] flex items-center justify-center w-full max-w-sm"
      ref={profileMenuRef}
    >
      <button
        onClick={toggleProfileMenu}
        className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white"
      >
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Foto de perfil"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-white">
            ?
          </div>
        )}
      </button>
      <div
        className={`${
          isProfileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-all duration-300 ease-out
        absolute right-0 top-full mt-2
        w-44 bg-white rounded-lg shadow-lg py-2 z-[70]`}
      >
        <button
          onClick={() => {
            router.push("/perfil");
            setIsProfileOpen(false);
            setIsMenuOpen(false);
          }}
          className="w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 font-medium hover:text-cyan-600 transition-colors duration-200"
        >
          Perfil
        </button>
        <button
          onClick={() => {
            cerrarSesion();
            setIsProfileOpen(false);
            setIsMenuOpen(false);
          }}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium hover:text-red-700 transition-colors duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default MobileMenuUser;
