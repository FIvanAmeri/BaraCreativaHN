import React from "react";

interface Props {
  children: React.ReactNode;
}

export const ContenedorFijoCentrado: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative w-full py-10"> 
      {children}
    </div>
  );
};