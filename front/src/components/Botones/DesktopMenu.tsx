import React from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BotonConEfecto from "../Botones/BotonConEfecto";
import SobreComunidadButton from "../Botones/sobre-nosotros";
import ComunidadButton from "../Botones/comunidad";
import Academias from "../Botones/academias";
import BarraBusqueda from "../BarraBusqueda/barrabusqueda";
import Cursos from "../Botones/cursos";
import Contactenos from "../Botones/contactenos";

interface DesktopMenuProps {
  isProfileOpen: boolean;
  toggleProfileMenu: () => void;
  setIsProfileOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
}

export default function DesktopMenu({
  isProfileOpen,
  toggleProfileMenu,
  setIsProfileOpen,
  setIsMenuOpen,
  profileMenuRef,
}: DesktopMenuProps) {
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

  return (
    <div
      className={`
        hidden lg:flex flex-col lg:flex-row lg:items-center
        w-full lg:w-auto
        p-6 lg:p-0
        z-50
      `}
    >
      <div className="flex flex-row items-center w-full lg:w-auto gap-4 lg:gap-6">
        <div className="hidden lg:flex flex-row items-center gap-4 lg:gap-6">
          <SobreComunidadButton />
          <ComunidadButton />
          <Academias />
        </div>
        <BarraBusqueda className="hidden lg:flex flex-grow min-w-[200px] max-w-[656px] lg:max-w-[400px] xl:max-w-[656px]" />
        <div className="hidden lg:flex flex-row items-center gap-4 lg:gap-6">
          <Cursos />
          <Contactenos />
        </div>
      </div>
      {cargandoUsuario ? (
        <div className="px-4 py-2 rounded-lg font-medium text-white bg-gray-400 animate-pulse whitespace-nowrap lg:ml-6">
          Cargando...
        </div>
      ) : usuario ? (
        <div className="relative z-[60] lg:ml-6 flex items-center justify-center lg:justify-start" ref={profileMenuRef}>
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
        <BotonConEfecto texto="Acceso" href="/login" className="lg:ml-6 mt-4 lg:mt-0" />
      )}
    </div>
  );
}