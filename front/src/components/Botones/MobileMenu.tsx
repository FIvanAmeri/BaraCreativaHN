import React from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BotonConEfecto from "../Botones/BotonConEfecto";
import SobreComunidadButton from "../Botones/sobre-nosotros";
import ComunidadButton from "../Botones/comunidad";
import Academias from "../Botones/academias";
import Cursos from "../Botones/cursos";
import Contactenos from "../Botones/contactenos";
import BarraBusqueda from "../BarraBusqueda/barrabusqueda";

interface MobileMenuProps {
  isMenuOpen: boolean;
  isProfileOpen: boolean;
  toggleProfileMenu: () => void;
  setIsProfileOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
}

export default function MobileMenu({
  isMenuOpen,
  isProfileOpen,
  toggleProfileMenu,
  setIsProfileOpen,
  setIsMenuOpen,
  profileMenuRef,
}: MobileMenuProps) {
  const router = useRouter();
  const { usuario, cargandoUsuario, cerrarSesion } = useAuth();

  const getProfileImageUrl = (fotoPerfil: string | null | undefined) => {
    if (!fotoPerfil) {
      return null;
    }
    if (fotoPerfil.startsWith('http') || fotoPerfil.startsWith('/')) {
      return fotoPerfil;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/perfiles/${fotoPerfil}`;
  };

  const profileImageUrl = usuario ? getProfileImageUrl(usuario.fotoPerfil) : null;

  if (!isMenuOpen) {
    return null;
  }

  return (
    <div className="lg:hidden absolute top-full left-0 w-full bg-gray-900 backdrop-blur z-50 p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-sm">
          <SobreComunidadButton />
        </div>
        <div className="w-full max-w-sm">
          <ComunidadButton />
        </div>
        <div className="w-full max-w-sm">
          <Academias />
        </div>
        <div className="w-full max-w-sm">
          <Cursos />
        </div>
        <div className="w-full max-w-sm">
          <Contactenos />
        </div>
        <BarraBusqueda className="w-full max-w-sm" />
        {cargandoUsuario ? (
          <div className="px-4 py-2 rounded-lg font-medium text-white bg-gray-400 animate-pulse whitespace-nowrap w-full max-w-sm text-center">
            Cargando...
          </div>
        ) : usuario ? (
          <div className="relative z-[60] flex items-center justify-center w-full max-w-sm" ref={profileMenuRef}>
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
        ) : (
          <BotonConEfecto texto="Acceso" href="/login" className="w-full max-w-sm" />
        )}
      </div>
    </div>
  );
}