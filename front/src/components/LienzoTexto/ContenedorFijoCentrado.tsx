import React from "react";

interface Props {
  children: React.ReactNode;
}

export const ContenedorFijoCentrado: React.FC<Props> = ({ children }) => {
  return (
    <div className="md:relative md:w-full md:h-auto md:flex md:justify-center md:items-center fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-[150px] pointer-events-none z-50">
      {children}
    </div>
  );
};