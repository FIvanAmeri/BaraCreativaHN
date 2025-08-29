import React from 'react';

interface ContenedorContenidoProps {
  tipo: string;
  urlContenido?: string | null;
  contenidoTexto?: string | null;
}

const isYouTubeUrl = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  return `https://www.youtube.com/embed/${videoId}`;
};

export default function ContenedorContenido({
  tipo,
  urlContenido,
  contenidoTexto,
}: ContenedorContenidoProps) {
  // Manejo de SCORM, se mantiene sin cambios
  if (tipo === 'scorm' && urlContenido) {
    return (
      <iframe
        src={urlContenido}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="SCORM Content"
        allowFullScreen
      />
    );
  }

  // Manejo de contenido de texto y URLs
  if (tipo === 'texto') {
    const isUrl = contenidoTexto && (contenidoTexto.startsWith('http://') || contenidoTexto.startsWith('https://'));
    if (isUrl) {
      return (
        <div className="p-4 text-center w-full h-full flex items-center justify-center">
          <a
            href={contenidoTexto}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
          >
            {contenidoTexto}
          </a>
        </div>
      );
    }
    return (
      <div className="p-4 text-center w-full h-full flex items-center justify-center">
        <p className="text-lg text-gray-200">{contenidoTexto || "No hay contenido de texto disponible."}</p>
      </div>
    );
  }

  // Manejo de videos (incluyendo YouTube)
  if (tipo === 'video' && urlContenido) {
    if (isYouTubeUrl(urlContenido)) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="relative w-full h-0 pb-[56.25%] rounded-lg shadow-lg overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-none"
              src={getYouTubeEmbedUrl(urlContenido)}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
    // Para videos no-YouTube o archivos subidos
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <video
          key={urlContenido}
          controls
          className="w-full h-auto max-h-full object-contain rounded-lg shadow-lg"
          preload="auto"
        >
          <source src={urlContenido} type="video/mp4" />
          Tu navegador no soporta el tag de video para este contenido.
        </video>
      </div>
    );
  }

  // Manejo de PDFs
  if (tipo === 'pdf' && urlContenido) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <iframe
          key={urlContenido}
          src={urlContenido}
          className="w-full h-full border-none rounded-lg shadow-lg"
          title="PDF Content"
        />
      </div>
    );
  }

  // Manejo de imágenes
  if (tipo === 'imagen' && urlContenido) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <img
          key={urlContenido}
          src={urlContenido}
          alt="Contenido de Imagen"
          className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="p-4 text-red-500 text-center w-full h-full flex items-center justify-center">
      <p>Tipo de contenido no soportado o URL no disponible.</p>
    </div>
  );
}
