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

  const handleFileChange = (index: number, file: File) => {
    const updatedContenido = [...(modulo.contenido ?? [])];
    if (updatedContenido[index]) {
      updatedContenido[index].file = file;
      onUpdate({
        ...modulo,
        contenido: updatedContenido,
      });
    }
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
        return 'Pega la URL del video de YouTube, Vimeo, etc.';
      case ContenidoTipo.PDF:
        return 'Pega la URL del PDF';
      case ContenidoTipo.IMAGEN:
        return 'Pega la URL de la imagen';
      default:
        return '';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.TEXTO)} style={buttonStyle}>Agregar Texto/URL</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.VIDEO)} style={buttonStyle}>Agregar Video</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.PDF)} style={buttonStyle}>Agregar PDF</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.IMAGEN)} style={buttonStyle}>Agregar Imagen</button>
      </div>
      {(modulo.contenido ?? []).map((item, index) => (
        <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{item.tipo.toUpperCase()}</span>
            <button type="button" onClick={() => handleRemoveContenido(index)} style={{ ...buttonStyle, backgroundColor: '#b91c1c', padding: '5px 10px' }}>Eliminar</button>
          </div>
          {(item.tipo === ContenidoTipo.TEXTO || item.tipo === ContenidoTipo.VIDEO || item.tipo === ContenidoTipo.PDF || item.tipo === ContenidoTipo.IMAGEN) ? (
            <input
              type="text"
              value={item.valor}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={getPlaceholder(item.tipo)}
              style={inputStyle}
            />
          ) : (
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileChange(index, file);
                }
              }}
              style={{ marginTop: '10px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ModuloContenidoEditor;
