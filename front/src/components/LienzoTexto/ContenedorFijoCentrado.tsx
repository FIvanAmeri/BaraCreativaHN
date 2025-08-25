import React from "react";

interface Props {
  children: React.ReactNode;
}

export const ContenedorFijoCentrado: React.FC<Props> = ({ children }) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-[150px] pointer-events-none z-50">
      {children}
    </div>
  );
};
