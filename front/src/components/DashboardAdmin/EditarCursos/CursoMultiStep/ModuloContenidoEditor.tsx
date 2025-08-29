import React, { ChangeEvent } from 'react';
import { ContenidoItem, ContenidoTipo, EditableModuloForm } from '@/app/types/curso';
import { labelStyle, inputStyle, buttonStyle } from './estilos';

interface Props {
  modulo: EditableModuloForm;
  onUpdate: (updatedModulo: EditableModuloForm) => void;
}

const ModuloContenidoEditor: React.FC<Props> = ({ modulo, onUpdate }) => {
  const handleAddContenido = (tipo: ContenidoTipo) => {
    const newContenido: ContenidoItem = {
      tipo,
      valor: '',
    };
    onUpdate({
      ...modulo,
      contenido: [...(modulo.contenido ?? []), newContenido],
    });
  };

  const handleChange = (index: number, value: string) => {
    const updatedContenido = [...(modulo.contenido ?? [])];
    if (updatedContenido[index]) {
      updatedContenido[index].valor = value;
      onUpdate({
        ...modulo,
        contenido: updatedContenido,
      });
    }
  };

  const handleFileChange = (index: number, files: FileList | null) => {
    if (!files) return;

    const updatedContenido = [...(modulo.contenido ?? [])];
    const newItems = Array.from(files).map(file => ({
      tipo: updatedContenido[index]?.tipo,
      file: file,
      valor: '', // Se inicializa como una cadena vacía para evitar errores de tipo.
    }));
    
    updatedContenido.splice(index, 1, ...newItems);

    onUpdate({
      ...modulo,
      contenido: updatedContenido as ContenidoItem[],
    });
  };

  const handleRemoveContenido = (index: number) => {
    const updatedContenido = (modulo.contenido ?? []).filter((_, i) => i !== index);
    onUpdate({
      ...modulo,
      contenido: updatedContenido,
    });
  };

  const getPlaceholder = (tipo: ContenidoTipo) => {
    switch (tipo) {
      case ContenidoTipo.TEXTO:
        return 'Escribe tu texto o pega una URL de video, PDF, etc.';
      case ContenidoTipo.VIDEO:
        return 'Sube uno o varios archivos de video.';
      case ContenidoTipo.PDF:
        return 'Sube uno o varios archivos PDF.';
      case ContenidoTipo.IMAGEN:
        return 'Sube una o varias imágenes.';
      default:
        return '';
    }
  };

  // Estilos mejorados para los botones, con un toque "tecnológico"
  const improvedButtonStyles = {
    ...buttonStyle,
    backgroundColor: '#3b82f6', // Un azul más vibrante
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '12px', // Bordes más suaves
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#2563eb',
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.TEXTO)} style={improvedButtonStyles}>Agregar Texto</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.VIDEO)} style={improvedButtonStyles}>Agregar Video</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.PDF)} style={improvedButtonStyles}>Agregar PDF</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.IMAGEN)} style={improvedButtonStyles}>Agregar Imagen</button>
      </div>
      {(modulo.contenido ?? []).map((item, index) => (
        <div key={index} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#5a1a01' }}>{item.tipo.toUpperCase()}</span>
            <button type="button" onClick={() => handleRemoveContenido(index)} style={{ ...buttonStyle, backgroundColor: '#b91c1c', padding: '5px 10px' }}>Eliminar</button>
          </div>
          {item.tipo === ContenidoTipo.TEXTO ? (
            <input
              type="text"
              value={item.valor ?? ''}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={getPlaceholder(item.tipo)}
              style={inputStyle}
            />
          ) : (
            <div>
              {item.file ? (
                <p>Archivo seleccionado: {item.file.name}</p>
              ) : (
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(index, e.target.files)}
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModuloContenidoEditor;
