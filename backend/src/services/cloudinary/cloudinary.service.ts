import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from '../../interfaces/cloudinary-response';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'cursos_imagenes' },
        (error, result) => {
          if (error) {
            console.error('Error al subir a Cloudinary:', error);
            reject(new InternalServerErrorException('Error al subir la imagen a Cloudinary.'));
          }
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new InternalServerErrorException('No se recibió una URL válida de Cloudinary.'));
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
