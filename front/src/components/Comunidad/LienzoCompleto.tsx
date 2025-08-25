import { LienzoPintado } from "./LienzoPintado";
import { LienzoTexto } from "./LienzoTexto";

export const LienzoCompleto = () => {
  return (
    <>
      <LienzoPintado>
        <LienzoTexto />
      </LienzoPintado>
    </>
  );
};