import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  direccion: "izquierda" | "derecha";
  onClick: () => void;
}

export const BotonNavegacion = ({ direccion, onClick }: Props) => {
  const esIzquierda = direccion === "izquierda";
  return (
    <button
      onClick={onClick}
      className={`absolute ${esIzquierda ? "left-1 sm:left-4" : "right-1 sm:right-4"} top-1/2 transform -translate-y-1/2 z-30 bg-white p-1 sm:p-2 rounded-full shadow`}
    >
      {esIzquierda ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
};
