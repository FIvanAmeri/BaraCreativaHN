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
  
  const fileButtonStyles = {
    ...buttonStyle,
    backgroundColor: '#b91c1c',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '9999px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    },
  };

  const removeButtonStyles = {
    ...buttonStyle,
    backgroundColor: '#b91c1c',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '9999px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const fileInputStyles = {
    marginTop: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#000',
    width: '100%',
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.TEXTO)} style={fileButtonStyles}>Agregar Texto/URL</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.VIDEO)} style={fileButtonStyles}>Agregar Video</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.PDF)} style={fileButtonStyles}>Agregar PDF</button>
        <button type="button" onClick={() => handleAddContenido(ContenidoTipo.IMAGEN)} style={fileButtonStyles}>Agregar Imagen</button>
      </div>
      {(modulo.contenido ?? []).map((item, index) => (
        <div key={index} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#5a1a01' }}>{item.tipo.toUpperCase()}</span>
            <button type="button" onClick={() => handleRemoveContenido(index)} style={removeButtonStyles}>Eliminar</button>
          </div>
          {item.tipo === ContenidoTipo.TEXTO ? (
            <input
              type="text"
              value={item.valor}
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileChange(index, file);
                    }
                  }}
                  style={fileInputStyles}
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
