"use client";

import React from "react";
import BarraBusqueda from "../BarraBusqueda/barrabusqueda";
import MobileMenuNav from "./MobileMenuNav";
import MobileMenuUser from "./MobileMenuUser";

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
  if (!isMenuOpen) return null;

  return (
    <div className="lg:hidden absolute top-full left-0 w-full bg-gray-900 backdrop-blur z-50 p-4">
      <div className="flex flex-col items-center space-y-4">
        <MobileMenuNav onClose={() => setIsMenuOpen(false)} />


        <BarraBusqueda className="w-full max-w-sm" />


        <MobileMenuUser
          isProfileOpen={isProfileOpen}
          toggleProfileMenu={toggleProfileMenu}
          setIsProfileOpen={setIsProfileOpen}
          setIsMenuOpen={setIsMenuOpen}
          profileMenuRef={profileMenuRef}
        />
      </div>
    </div>
  );
}
