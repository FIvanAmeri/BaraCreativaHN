export enum ClaseItem {
  CURSO = 'curso',
  SERVICIO = 'servicio',
}

export enum TipoCurso {
  DOCENTES = 'Docentes',
  ESTUDIANTES = 'Estudiantes',
  EMPRESAS = 'Empresas',
}

export enum ContenidoTipo {
  TEXTO = 'texto',
  VIDEO = 'video',
  PDF = 'pdf',
  IMAGEN = 'imagen',
}

export interface ContenidoItem {
  tipo: ContenidoTipo;
  valor: string; // Para texto o URL
  file?: File; // Para archivos subidos
}

export interface Modulo {
  id: number;
  titulo: string;
  descripcion: string | null;
  videoUrl?: string[] | null;
  pdfUrl?: string[] | null;
  imageUrl?: string[] | null;
  contenido?: ContenidoItem[];
  orden?: number | null;
  tipo?: string | null;
}

export interface ModuloFormBase {
  titulo: string;
  descripcion: string | null;
}

// Interfaz corregida para incluir las propiedades de archivos
export interface EditableModuloForm extends ModuloFormBase {
  id?: number;
  contenido?: ContenidoItem[];
  videoUrl?: string[] | null;
  pdfUrl?: string[] | null;
  imageUrl?: string[] | null;
}

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  duracionHoras: number;
  tipo: TipoCurso;
  categoria: string;
  subcategoria?: string | null;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso: string | null;
  archivoScorm: string | null;
  modulos: Modulo[];
  claseItem: ClaseItem;
  fechaInicio: Date | null;
}

export interface RawCursoApiResponse {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string | null;
  duracionHoras: number;
  tipo: TipoCurso;
  categoria: string;
  subcategoria?: string;
  precio: string | number;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  imagenCurso: string | null;
  archivoScorm: string | null;
  claseItem: ClaseItem;
  modulos: Modulo[];
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
}

export interface CursoForm {
  id?: number;
  titulo: string;
  descripcion: string;
  precio: number | '';
  duracionHoras: number | '';
  tipo: TipoCurso | '';
  categoria: string;
  subcategoria?: string | null;
  modalidad: 'en vivo' | 'grabado' | 'mixto' | '';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: File | string | null;
  archivoScorm?: File | string | null;
  modulos: EditableModuloForm[];
  newScormFile?: File | null;
  claseItem: ClaseItem | '';
  fechaInicio?: Date | null;
}

export interface ModuloResumen {
  id: number;
  titulo: string;
}

export interface ApiCurso {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  duracionHoras: number;
  tipo: TipoCurso;
  categoria: string;
  subcategoria?: string | null;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso: string | null;
  archivoScorm: string | null;
  claseItem: ClaseItem;
  fechaInicio: Date | null;
  modulos: ModuloResumen[];
}

export interface MarcarModuloCompletadoDto {
  cursoId: number;
  moduloId: number;
}
