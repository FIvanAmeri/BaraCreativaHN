'use client';

import { useState, useEffect } from 'react';
import { Curso } from '@/app/types/curso';
// No necesitamos los componentes ni el hook de SCORM en esta página
// import { useCursoScorm } from '@/app/hooks/Scorm/useCursoScorm';
// import ListaModulos from '@/components/Scorm/ListaModulos';
// import NavegacionModulos from '@/components/Scorm/Navegacion';

export default function CursosPage() {
  // CAMBIO 1: El estado ahora guarda una lista de cursos.
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCursosData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cursos`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error al obtener la lista de cursos');
        }
        const fetchedCursos: Curso[] = await response.json();
        
        // CAMBIO 2: Guardamos la lista completa en el estado.
        setCursos(fetchedCursos);
        setError(null);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCursosData();
  }, []);

  if (loading) return <div>Cargando cursos...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // CAMBIO 3: Si no hay cursos, mostramos un mensaje.
  if (cursos.length === 0) return <div>No se encontraron cursos disponibles.</div>;

  // CAMBIO 4: Iteramos sobre la lista de cursos para mostrar las "tarjetas"
  return (
    <div style={{ padding: '20px' }}>
      <h1>Cursos Disponibles</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {cursos.map(curso => (
          <div 
            key={curso.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              width: '300px', // Ajusta el ancho de las tarjetas
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {curso.imagenCurso && (
              <img src={curso.imagenCurso} alt={`Imagen del curso ${curso.titulo}`} 
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />
            )}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{curso.titulo}</h2>
            <p style={{ fontSize: '1rem', color: '#666' }}>{curso.descripcion}</p>
            <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Precio: ${curso.precio}</p>
            <button 
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Ver Detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

