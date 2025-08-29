import { useState, ChangeEvent, FormEvent } from "react";
import { CursoForm, Curso, EditableModuloForm, TipoCurso, ClaseItem } from "@/app/types/curso";
import { ContenidoTipo } from "@/app/types/curso";

interface UseCursoFormularioReturn {
  step: number;
  form: CursoForm;
  error: string;
  exito: string;
  loading: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAddModulo: () => void;
  handleRemoveModulo: (index: number) => void;
  handleModuloTitleChange: (index: number, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setForm: React.Dispatch<React.SetStateAction<CursoForm>>;
}

export const useCursoFormulario = (
  onGuardar: (curso: Curso) => Promise<void>,
  routerPush: (path: string) => void
): UseCursoFormularioReturn => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CursoForm>({
    titulo: "",
    descripcion: "",
    precio: "",
    duracionHoras: "",
    tipo: "",
    categoria: "",
    subcategoria: null,
    modalidad: "",
    certificadoDisponible: false,
    badgeDisponible: false,
    imagenCurso: null,
    archivoScorm: null,
    modulos: [{ id: 0, titulo: "", descripcion: null, contenido: [] }],
    newScormFile: null,
    claseItem: "",
    fechaInicio: null,
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === "archivoScorm") {
        setForm((prev) => ({
          ...prev,
          newScormFile: files[0],
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    }
  };

  const handleAddModulo = () => {
    setForm((prev) => ({
      ...prev,
      modulos: [
        ...prev.modulos,
        {
          id: prev.modulos.length,
          titulo: "",
          descripcion: null,
          contenido: [],
        },
      ],
    }));
  };

  const handleRemoveModulo = (index: number) => {
    setForm((prev) => {
      const newModulos = prev.modulos.filter((_, i) => i !== index);
      return { ...prev, modulos: newModulos };
    });
  };

  const handleModuloTitleChange = (index: number, value: string) => {
    setForm((prev) => {
      const newModulos = [...prev.modulos];
      newModulos[index] = { ...newModulos[index], titulo: value };
      return { ...prev, modulos: newModulos };
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setExito("");

    try {
      const newCurso: Curso = {
        id: form.id || 0,
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        duracionHoras: Number(form.duracionHoras),
        tipo: form.tipo as TipoCurso,
        categoria: form.categoria,
        subcategoria: form.subcategoria,
        modalidad: form.modalidad as 'en vivo' | 'grabado' | 'mixto',
        certificadoDisponible: form.certificadoDisponible,
        badgeDisponible: form.badgeDisponible,
        imagenCurso: (form.imagenCurso instanceof File) ? "" : (form.imagenCurso || null),
        archivoScorm: (form.archivoScorm instanceof File) ? "" : (form.archivoScorm || null),
        claseItem: form.claseItem as ClaseItem,
        fechaInicio: form.fechaInicio instanceof Date ? form.fechaInicio : null,
        modulos: form.modulos.map((m) => ({
          id: m.id || 0,
          titulo: m.titulo,
          descripcion: m.descripcion || null,
          contenido: m.contenido,
        })),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos`, {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCurso),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar el curso");
      }

      const createdCurso = await res.json();

      const formData = new FormData();
      if (form.imagenCurso instanceof File) {
        formData.append("imagenCurso", form.imagenCurso);
      }
      if (form.newScormFile instanceof File) {
        formData.append("archivoScorm", form.newScormFile);
      }
      
      const filesAttached = Array.from(formData.entries()).length > 0;
      if (filesAttached) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${createdCurso.id}/files`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
      }

      for (const moduloForm of form.modulos) {
        const formDataModuleFiles = new FormData();
        // === CORRECCIÓN APLICADA AQUÍ ===
        const filesToUpload = (moduloForm.contenido ?? []).filter(item => item.file instanceof File);
        
        if (filesToUpload.length > 0) {
          filesToUpload.forEach((item) => {
            const fileType = item.tipo;
            formDataModuleFiles.append(fileType, item.file as File);
          });
          
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cursos/modulos/${moduloForm.id}/files`,
            {
              method: "POST",
              body: formDataModuleFiles,
              credentials: "include",
            }
          );
        }
      }

      setExito("Curso creado y archivos subidos correctamente");
      await onGuardar(createdCurso);
      routerPush("/perfil");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    form,
    error,
    exito,
    loading,
    handleChange,
    handleFileChange,
    handleAddModulo,
    handleRemoveModulo,
    handleModuloTitleChange,
    nextStep,
    prevStep,
    handleSubmit,
    setForm,
  };
};
