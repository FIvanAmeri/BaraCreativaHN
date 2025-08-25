import React from "react";

interface Props {
  children: React.ReactNode;
}

export const ContenedorFijoCentrado: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
};