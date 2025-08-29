"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Curso, EditableModuloForm, CursoForm, TipoCurso, ClaseItem, ContenidoItem, ContenidoTipo } from "@/app/types/curso";

export default function useCursoForm(
  cursoInicial?: Curso,
  onCursoCreado?: (curso: Curso) => void
) {
  const [datos, setDatos] = useState<CursoForm>({
    titulo: "",
    descripcion: "",
    tipo: TipoCurso.DOCENTES,
    categoria: "",
    duracionHoras: "",
    precio: "",
    modalidad: "en vivo",
    certificadoDisponible: false,
    badgeDisponible: false,
    imagenCurso: null,
    modulos: [],
    claseItem: ClaseItem.CURSO,
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  useEffect(() => {
    if (cursoInicial) {
      setDatos({
        id: cursoInicial.id,
        titulo: cursoInicial.titulo,
        descripcion: cursoInicial.descripcion,
        tipo: cursoInicial.tipo,
        categoria: cursoInicial.categoria,
        subcategoria: cursoInicial.subcategoria,
        duracionHoras: cursoInicial.duracionHoras,
        precio: cursoInicial.precio,
        modalidad: cursoInicial.modalidad,
        certificadoDisponible: cursoInicial.certificadoDisponible,
        badgeDisponible: cursoInicial.badgeDisponible,
        imagenCurso: cursoInicial.imagenCurso,
        archivoScorm: cursoInicial.archivoScorm,
        claseItem: cursoInicial.claseItem,
        fechaInicio: cursoInicial.fechaInicio,
        modulos: cursoInicial.modulos.map((m) => {
          const contenido: ContenidoItem[] = [];
          if (m.contenido) {
            m.contenido.forEach(item => {
              contenido.push({ tipo: item.tipo, valor: item.valor });
            });
          }
          return {
            id: m.id,
            titulo: m.titulo,
            descripcion: m.descripcion,
            contenido,
          };
        }),
      });

      if (cursoInicial.imagenCurso) {
        setImagenPreview(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/imagenes-cursos/${cursoInicial.imagenCurso}`
        );
      }
    }
  }, [cursoInicial]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setDatos((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setDatos((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDatos((prev) => ({ ...prev, imagenCurso: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarModulo = () => {
    setDatos((prev) => ({
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

  const handleUpdateModulo = (index: number, updatedModulo: EditableModuloForm) => {
    setDatos(prev => {
      const newModulos = [...prev.modulos];
      newModulos[index] = updatedModulo;
      return { ...prev, modulos: newModulos };
    });
  };

  const eliminarModulo = (index: number) => {
    const nuevosModulos = [...datos.modulos];
    nuevosModulos.splice(index, 1);
    setDatos((prev) => ({ ...prev, modulos: nuevosModulos }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);
    setGuardando(true);

    if (!datos.titulo.trim()) {
      setError("El título es obligatorio");
      setGuardando(false);
      return;
    }

    if (!datos.descripcion.trim()) {
      setError("La descripción es obligatoria");
      setGuardando(false);
      return;
    }

    try {
      const cursoData = {
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        categoria: datos.categoria,
        subcategoria: datos.subcategoria,
        duracionHoras: Number(datos.duracionHoras),
        precio: Number(datos.precio),
        modalidad: datos.modalidad,
        certificadoDisponible: datos.certificadoDisponible,
        badgeDisponible: datos.badgeDisponible,
        claseItem: datos.claseItem,
        modulos: datos.modulos.map((m) => ({
          titulo: m.titulo,
          descripcion: m.descripcion,
          contenido: m.contenido.map(c => ({
            tipo: c.tipo,
            valor: c.valor
          }))
        })),
      };

      let res;
      if (cursoInicial && cursoInicial.id) {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${cursoInicial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cursoData),
          credentials: "include",
        });
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cursoData),
          credentials: "include",
        });
      }

      if (!res.ok) throw new Error("Error guardando curso");

      const cursoGuardado: Curso = await res.json();
      const cursoId = cursoGuardado.id;

      if (datos.imagenCurso && typeof datos.imagenCurso !== "string") {
        const formData = new FormData();
        formData.append("imagen", datos.imagenCurso);

        const resImg = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${cursoId}/imagen`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        if (!resImg.ok) throw new Error("Error subiendo imagen");
      }

      for (const moduloForm of datos.modulos) {
        const formDataModuleFiles = new FormData();
        const filesToUpload = moduloForm.contenido.filter(item => item.file instanceof File);

        if (filesToUpload.length > 0) {
          filesToUpload.forEach((item) => {
            formDataModuleFiles.append(item.tipo, item.file as File);
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

      onCursoCreado && onCursoCreado(cursoGuardado);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Error guardando el curso");
    } finally {
      setGuardando(false);
    }
  };

  return {
    datos,
    guardando,
    error,
    imagenPreview,
    handleChange,
    handleFileChange,
    agregarModulo,
    handleUpdateModulo,
    eliminarModulo,
    handleSubmit,
  };
}