import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { InternalServerErrorException } from '@nestjs/common';


export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    const configOptions: ConfigOptions = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    if (!configOptions.cloud_name || !configOptions.api_key || !configOptions.api_secret) {
      throw new InternalServerErrorException(
        'Las variables de entorno de Cloudinary no están configuradas correctamente. ' +
        'Revisa CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.'
      );
    }
    
    try {
      cloudinary.config(configOptions);
      console.log('Cloudinary ha sido configurado correctamente.');
    } catch (error) {
      console.error('Error al configurar Cloudinary:', error);
      throw new InternalServerErrorException(
        'Error inesperado al configurar Cloudinary. Verifica las variables de entorno.'
      );
    }
    
    return cloudinary;
  },
};
