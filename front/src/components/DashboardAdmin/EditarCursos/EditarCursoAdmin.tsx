import React from "react";
import { useEditarCursoForm } from "@/app/hooks/EditarCursoAdmin/useEditarCursoForm";
import { InputField } from "@/subcomponent/EditarCursoAdmin/InputField";
import { SelectField } from "@/subcomponent/EditarCursoAdmin/SelectField";
import { CheckboxField } from "@/subcomponent/EditarCursoAdmin/CheckboxField";
import { FileInput } from "@/subcomponent/EditarCursoAdmin/FileInput";
import { Message } from "@/subcomponent/EditarCursoAdmin/Message";
import { Curso } from "@/app/types/curso";

interface Props {
  curso: Curso;
  onGuardar: (curso: Curso) => Promise<void>;
  onCancelar: () => void;
}

const EditarCursoAdmin: React.FC<Props> = ({
  curso,
  onGuardar,
  onCancelar,
}) => {
  const {
    form,
    error,
    exito,
    loading,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useEditarCursoForm({ curso, onGuardar });

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Editar Curso SCORM
      </h2>

      <InputField
        label="Título"
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        required
      />
      <InputField
        label="Descripción"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        rows={4}
        required
      />
      <InputField
        label="Precio"
        name="precio"
        value={form.precio}
        onChange={handleChange}
        type="number"
      />
      <InputField
        label="Duración (horas)"
        name="duracionHoras"
        value={form.duracionHoras}
        onChange={handleChange}
        type="number"
      />
      <SelectField
        label="Tipo"
        name="tipo"
        value={form.tipo}
        onChange={handleChange}
        options={[
          { value: "Docentes", label: "Docentes" },
          { value: "Estudiantes", label: "Estudiantes" },
          { value: "Empresas", label: "Empresas" },
        ]}
        required
      />
      <InputField
        label="Categoría"
        name="categoria"
        value={form.categoria}
        onChange={handleChange}
        required
      />
      <SelectField
        label="Modalidad"
        name="modalidad"
        value={form.modalidad}
        onChange={handleChange}
        options={[
          { value: "en vivo", label: "En vivo" },
          { value: "grabado", label: "Grabado" },
          { value: "mixto", label: "Mixto" },
        ]}
        required
      />
      <CheckboxField
        label="Certificado disponible"
        name="certificadoDisponible"
        checked={form.certificadoDisponible}
        onChange={handleChange}
      />
      <CheckboxField
        label="Badge disponible"
        name="badgeDisponible"
        checked={form.badgeDisponible}
        onChange={handleChange}
      />
      <FileInput
        label="Imagen del curso (archivo o URL actual)"
        name="imagenCurso"
        accept="image/*"
        onChange={handleFileChange}
        preview={typeof form.imagenCurso === "string" ? form.imagenCurso : null}
      />
      <FileInput
        label="Archivo SCORM (.zip)"
        name="newScormFile"
        accept=".zip"
        onChange={handleFileChange}
      />

      {error && <Message message={error} type="error" />}
      {exito && <Message message={exito} type="success" />}

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f59e0b";
          e.currentTarget.style.color = "#5a1a01";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#b91c1c";
          e.currentTarget.style.color = "white";
        }}
      >
        {loading ? "Guardando..." : "Guardar Cambios"}
      </button>

      <button
        type="button"
        onClick={onCancelar}
        style={{ ...buttonStyle, backgroundColor: "#6b7280", marginTop: 10 }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#4b5563";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#6b7280";
        }}
      >
        Cancelar
      </button>
    </form>
  );
};

const formStyle: React.CSSProperties = {
  maxWidth: 700,
  margin: "2rem auto",
  padding: 24,
  borderRadius: 15,
  background: "linear-gradient(135deg, #ff6a00, #fddb92)",
  boxShadow: "0 10px 25px rgba(255, 105, 0, 0.3)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: "#5a1a01",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: 10,
  border: "none",
  backgroundColor: "#b91c1c",
  color: "white",
  fontWeight: 700,
  fontSize: "1.1rem",
  cursor: "pointer",
  boxShadow: "0 5px 15px rgba(185, 28, 28, 0.5)",
  transition: "background-color 0.3s ease",
};

export default EditarCursoAdmin;
