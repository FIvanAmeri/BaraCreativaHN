import { useState, ChangeEvent, FormEvent } from 'react';
import { CursoForm, Curso, ClaseItem, Modulo } from '@/app/types/curso';

interface Props {
  curso: Curso;
  onGuardar: (curso: Curso) => Promise<void>;
}

export const useEditarCursoForm = ({ curso, onGuardar }: Props) => {
  const [form, setForm] = useState<CursoForm>({
    titulo: curso.titulo || '',
    descripcion: curso.descripcion || '',
    precio: curso.precio || '',
    duracionHoras: curso.duracionHoras || '',
    tipo: curso.tipo || '',
    categoria: curso.categoria || '',
    modalidad: curso.modalidad || '',
    certificadoDisponible: curso.certificadoDisponible || false,
    badgeDisponible: curso.badgeDisponible || false,
    imagenCurso: curso.imagenCurso || null,
    archivoScorm: curso.archivoScorm || null,
    newScormFile: null,
    claseItem: curso.claseItem || ClaseItem.CURSO,
    // === CORRECCIÓN APLICADA AQUÍ ===
    modulos: (curso.modulos || []).map((mod: Modulo) => ({
      ...mod,
      contenido: mod.contenido || [], // Garantiza que 'contenido' siempre es un array
    })),
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: target.checked }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'precio' || name === 'duracionHoras'
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    if (name === 'newScormFile') {
      const file = files[0];
      if (file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
        setError('Solo archivos .zip permitidos para SCORM');
        setForm((prev) => ({ ...prev, newScormFile: null }));
        return;
      }
      setForm((prev) => ({ ...prev, newScormFile: file }));
      setError('');
    } else if (name === 'imagenCurso') {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Solo imágenes permitidas para la imagen del curso');
        setForm((prev) => ({ ...prev, imagenCurso: null }));
        return;
      }
      setForm((prev) => ({ ...prev, imagenCurso: file }));
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (!form.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!form.descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    setLoading(true);

    try {
      const patchData = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        duracionHoras: Number(form.duracionHoras),
        tipo: form.tipo,
        categoria: form.categoria,
        modalidad: form.modalidad,
        certificadoDisponible: form.certificadoDisponible,
        badgeDisponible: form.badgeDisponible,
        claseItem: form.claseItem,
      };

      const resInfo = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${curso.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData),
        credentials: 'include',
      });

      if (!resInfo.ok) {
        const errData = await resInfo.json();
        throw new Error(errData.message || 'Error al actualizar información del curso');
      }

      if (form.imagenCurso instanceof File) {
        const formDataImagen = new FormData();
        formDataImagen.append('imagen', form.imagenCurso);
        const resImg = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${curso.id}/imagen`, {
          method: 'POST',
          body: formDataImagen,
          credentials: 'include',
        });
        if (!resImg.ok) {
          const errData = await resImg.json();
          throw new Error(errData.message || 'Error al subir imagen del curso');
        }
      }

      if (form.newScormFile) {
        const formDataScorm = new FormData();
        formDataScorm.append('scormFile', form.newScormFile);
        formDataScorm.append('cursoId', curso.id.toString());
        const resScorm = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/scorm_unzipped_courses`, {
          method: 'POST',
          body: formDataScorm,
          credentials: 'include',
        });
        if (!resScorm.ok) {
          const errData = await resScorm.json();
          throw new Error(errData.message || 'Error al subir archivo SCORM');
        }
      }

      setExito('Curso actualizado correctamente');
      const cursoActualizado = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${curso.id}`, {
        credentials: 'include',
      }).then(res => res.json());

      await onGuardar(cursoActualizado);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return { form, error, exito, loading, handleChange, handleFileChange, handleSubmit };
};