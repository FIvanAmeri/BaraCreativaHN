import { ReactNode } from "react";

interface Props {
  alturaNavbar: string;
  children: ReactNode;
}

export const ContenedorNosotros = ({ alturaNavbar, children }: Props) => {
  return (
    <div
      className="relative w-full bg-gray-100 flex flex-col items-center"
      style={{
        height: `calc(100vh - ${alturaNavbar})`,
        minHeight: `calc(100vh - ${alturaNavbar})`,
      }}
    >
      {children}
    </div>
  );
};
