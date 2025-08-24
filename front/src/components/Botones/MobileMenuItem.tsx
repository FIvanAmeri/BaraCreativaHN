"use client";

import React from "react";

interface MobileMenuItemProps {
  children: React.ReactNode;
  onClick: () => void;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ children, onClick }) => {
  return (
    <div className="w-full max-w-sm" onClick={onClick}>
      {children}
    </div>
  );
};

export default MobileMenuItem;
