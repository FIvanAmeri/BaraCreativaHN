import {
  IsString,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClaseItem } from '../../entidades/curso.entity';

export enum TipoCurso {
  DOCENTES = 'Docentes',
  ESTUDIANTES = 'Estudiantes',
  EMPRESAS = 'Empresas',
}

export enum ModalidadCurso {
  EN_VIVO = 'en vivo',
  GRABADO = 'grabado',
  MIXTO = 'mixto',
}

export enum ContenidoTipo {
  TEXTO = 'texto',
  VIDEO = 'video',
  PDF = 'pdf',
  IMAGEN = 'imagen',
}

export interface ContenidoItem {
  tipo: ContenidoTipo;
  valor: string;
}

export class ModuloDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString({ message: 'El título del módulo debe ser una cadena de texto.' })
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string | null;

  @IsOptional()
  @IsArray({ message: 'videoUrl debe ser un arreglo de cadenas de texto.' })
  @IsString({ each: true, message: 'Cada videoUrl debe ser una cadena de texto.' })
  videoUrl?: string[] | null;

  @IsOptional()
  @IsArray({ message: 'pdfUrl debe ser un arreglo de cadenas de texto.' })
  @IsString({ each: true, message: 'Cada pdfUrl debe ser una cadena de texto.' })
  pdfUrl?: string[] | null;

  @IsOptional()
  @IsArray({ message: 'imageUrl debe ser un arreglo de cadenas de texto.' })
  @IsString({ each: true, message: 'Cada imageUrl debe ser una cadena de texto.' })
  imageUrl?: string[] | null;

  @IsOptional()
  @IsEnum(ContenidoTipo, { message: 'El tipo de contenido no es válido.' })
  tipo?: ContenidoTipo;

  @IsOptional()
  @IsNumber({}, { message: 'El orden del módulo debe ser un número.' })
  orden?: number;
}

export class CrearCursoDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  descripcion: string;

  @IsString({ message: 'La categoría debe ser una cadena de texto.' })
  categoria: string;

  @IsOptional()
  @IsString({ message: 'La subcategoría debe ser una cadena de texto.' })
  subcategoria?: string | null;

  @IsNumber({}, { message: 'El precio debe ser un número válido.' })
  precio: number;

  @IsNumber({}, { message: 'La duración en horas debe ser un número válido.' })
  duracionHoras: number;

  @IsEnum(TipoCurso, { message: 'El tipo de curso no es válido.' })
  tipo: TipoCurso;

  @IsEnum(ModalidadCurso, { message: 'La modalidad de curso no es válida.' })
  modalidad: ModalidadCurso;

  @IsBoolean({ message: 'El campo certificadoDisponible debe ser booleano.' })
  certificadoDisponible: boolean;

  @IsBoolean({ message: 'El campo badgeDisponible debe ser booleano.' })
  badgeDisponible: boolean;

  @IsOptional()
  @IsString({ message: 'La imagen del curso debe ser una cadena de texto (URL/ruta).' })
  imagenCurso?: string | null;

  @IsOptional()
  @IsString({ message: 'El archivo SCORM debe ser una cadena de texto (URL/ruta).' })
  archivoScorm?: string | null;

  @IsEnum(ClaseItem, { message: 'La clase de ítem no es válida.' })
  claseItem: ClaseItem;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida.' })
  fechaInicio?: string | Date | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ModuloDto)
  @IsArray({ message: 'Los módulos deben ser un arreglo de objetos.' })
  modulos: ModuloDto[];
}
