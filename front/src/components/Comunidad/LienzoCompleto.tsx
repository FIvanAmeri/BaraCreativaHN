import { LienzoPintado } from "./LienzoPintado";
import { LienzoTexto } from "../LienzoTexto/LienzoTexto";

export const LienzoCompleto = () => {
  return (
    <>
      <LienzoPintado>
        <LienzoTexto />
      </LienzoPintado>
    </>
  );
};