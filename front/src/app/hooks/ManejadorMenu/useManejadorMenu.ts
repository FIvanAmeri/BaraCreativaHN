
import { useState, useRef, useEffect } from 'react';

interface UseManejadorMenuResult {
  isMenuOpen: boolean;
  isProfileOpen: boolean;
  toggleMenu: () => void;
  toggleProfileMenu: () => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  setIsProfileOpen: (isOpen: boolean) => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
  navbarRef: React.RefObject<HTMLDivElement>;
}

export const useManejadorMenu = (): UseManejadorMenuResult => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    function handleClickOutsideMenu(event: MouseEvent) {
      if (
        navbarRef.current &&
        isMenuOpen &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutsideMenu);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return {
    isMenuOpen,
    isProfileOpen,
    toggleMenu,
    toggleProfileMenu,
    setIsMenuOpen,
    setIsProfileOpen,
    profileMenuRef,
    navbarRef,
  };
};