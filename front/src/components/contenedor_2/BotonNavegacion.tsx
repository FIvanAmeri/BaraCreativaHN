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
      className={`absolute ${esIzquierda ? "left-6" : "right-4"} -mt-[100px] top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow`}
    >
      {esIzquierda ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
    </button>
  );
};
