"use client";

import React from "react";
import Logo from "../logo";
import { useManejadorMenu } from "../../app/hooks/ManejadorMenu/useManejadorMenu";
import DesktopMenu from "../Botones/DesktopMenu";
import MobileMenu from "../Botones/MobileMenu";

export default function Navbar() {
  const {
    isMenuOpen,
    isProfileOpen,
    toggleMenu,
    toggleProfileMenu,
    setIsMenuOpen,
    setIsProfileOpen,
    profileMenuRef,
    navbarRef,
  } = useManejadorMenu();

  return (
    <nav className={`w-full bg-primary mt-[5px] h-[100px] relative z-30`} ref={navbarRef}>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 lg:px-8 h-full">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Logo />
          <button
            className="lg:hidden text-white ml-2 z-[60] relative"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
        <DesktopMenu
          isProfileOpen={isProfileOpen}
          toggleProfileMenu={toggleProfileMenu}
          setIsProfileOpen={setIsProfileOpen}
          setIsMenuOpen={setIsMenuOpen}
          profileMenuRef={profileMenuRef}
        />
        <MobileMenu
          isMenuOpen={isMenuOpen}
          isProfileOpen={isProfileOpen}
          toggleProfileMenu={toggleProfileMenu}
          setIsProfileOpen={setIsProfileOpen}
          setIsMenuOpen={setIsMenuOpen}
          profileMenuRef={profileMenuRef}
        />
      </div>
    </nav>
  );
}