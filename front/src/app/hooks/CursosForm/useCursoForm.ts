"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Curso } from "../../types/curso";
import { EditableModuloForm, CursoForm, TipoCurso, ClaseItem } from "@/app/types/curso";

export default function useCursoForm(
  cursoInicial?: Curso,
  onCursoCreado?: (curso: Curso) => void
) {
  const [datos, setDatos] = useState<CursoForm>({
    titulo: "",
    descripcion: "",
    tipo: TipoCurso.DOCENTES,
    categoria: "",
    duracionHoras: 1,
    precio: 0,
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
        titulo: cursoInicial.titulo,
        descripcion: cursoInicial.descripcion,
        tipo: cursoInicial.tipo,
        categoria: cursoInicial.categoria,
        duracionHoras: cursoInicial.duracionHoras,
        precio: Number(cursoInicial.precio),
        modalidad: cursoInicial.modalidad,
        certificadoDisponible: cursoInicial.certificadoDisponible,
        badgeDisponible: cursoInicial.badgeDisponible,
        imagenCurso: null,
        claseItem: cursoInicial.claseItem,
        modulos: cursoInicial.modulos
          ? cursoInicial.modulos.map((m) => ({
              titulo: m.titulo,
              descripcion: m.descripcion,
              videoFile: null,
              pdfFile: null,
              imageFile: null,
              videoUrl: m.videoUrl,
              pdfUrl: m.pdfUrl,
              imageUrl: m.imageUrl,
            }))
          : [],
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
    } else if (type === "number") {
      setDatos((prev) => ({ ...prev, [name]: Number(value) }));
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
          titulo: "",
          descripcion: null,
          videoFile: null,
          pdfFile: null,
          imageFile: null,
          videoUrl: null,
          pdfUrl: null,
          imageUrl: null,
        },
      ],
    }));
  };

  const handleModuloChange = <K extends keyof EditableModuloForm>(
    index: number,
    field: K,
    value: EditableModuloForm[K]
  ) => {
    const nuevosModulos = [...datos.modulos];
    nuevosModulos[index] = { ...nuevosModulos[index], [field]: value };
    setDatos((prev) => ({ ...prev, modulos: nuevosModulos }));
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
        duracionHoras: datos.duracionHoras,
        precio: datos.precio,
        modalidad: datos.modalidad,
        certificadoDisponible: datos.certificadoDisponible,
        badgeDisponible: datos.badgeDisponible,
        claseItem: datos.claseItem,
        modulos: datos.modulos.map((m) => ({
          titulo: m.titulo,
          descripcion: m.descripcion,
          videoUrl: m.videoUrl,
          pdfUrl: m.pdfUrl,
          imageUrl: m.imageUrl,
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

      if (datos.imagenCurso && typeof datos.imagenCurso !== "string") {
        const formData = new FormData();
        formData.append("imagen", datos.imagenCurso);

        const resImg = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${cursoGuardado.id}/imagen`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        if (!resImg.ok) throw new Error("Error subiendo imagen");

        const jsonImg = await resImg.json();
        onCursoCreado && onCursoCreado(jsonImg.curso);
        return;
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
    handleModuloChange,
    eliminarModulo,
    handleSubmit,
  }
}