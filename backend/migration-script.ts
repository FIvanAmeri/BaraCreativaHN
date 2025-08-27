// Importa las dependencias necesarias
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { Usuario } from './src/entidades/usuario.entity';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { v2 as cloudinary } from 'cloudinary';

// Importa el módulo de migración que ahora tiene su propia conexión
import { MigrationModule } from './src/migration.module';

async function bootstrap() {
    console.log('Iniciando el script de migración...');

    try {
        // 1. Crea una instancia de la aplicación NestJS usando el módulo de migración
        const app: INestApplicationContext = await NestFactory.createApplicationContext(MigrationModule);

        // 2. Obtén el repositorio de usuarios de NestJS
        const usuariosRepository = app.get<Repository<Usuario>>('UsuarioRepository');

        // VERIFICACIÓN DE SEGURIDAD: Asegúrate de que el repositorio se haya inyectado correctamente
        if (!usuariosRepository) {
            throw new Error('El repositorio de usuarios no se pudo obtener del contexto de NestJS.');
        }

        // VERIFICACIÓN DE SEGURIDAD: Comprueba que las variables de entorno de Cloudinary existan
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error('Las variables de entorno de Cloudinary no están configuradas.');
        }

        // 3. Configura Cloudinary con las credenciales verificadas
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        const uploadsPath = path.join(__dirname, 'uploads', 'perfiles');

        // VERIFICACIÓN DE SEGURIDAD: Asegúrate de que la carpeta de subidas exista
        if (!fs.existsSync(uploadsPath)) {
            console.warn(`La carpeta de subidas no existe en la ruta: ${uploadsPath}. No hay archivos para migrar.`);
            await app.close();
            return;
        }
        
        // 4. Leer los archivos en la carpeta de subidas
        const files = fs.readdirSync(uploadsPath);

        console.log(`Encontrados ${files.length} archivos en la carpeta de subidas.`);
        
        for (const file of files) {
            const filePath = path.join(uploadsPath, file);

            try {
                // 5. Buscar al usuario por el nombre de la foto de perfil
                const usuario = await usuariosRepository.findOne({ where: { fotoPerfil: file } });

                if (usuario) {
                    console.log(`Migrando la foto de perfil para el usuario con ID: ${usuario.id}`);

                    // 6. Subir la imagen a Cloudinary
                    const uploadResult = await cloudinary.uploader.upload(filePath);
                    const cloudinaryUrl: string = uploadResult.secure_url;

                    // 7. Actualizar el registro del usuario en la base de datos
                    await usuariosRepository.update(usuario.id, { fotoPerfil: cloudinaryUrl });
                    console.log(`Migración exitosa para ${file}. Nueva URL: ${cloudinaryUrl}`);
                } else {
                    console.log(`Saltando el archivo ${file}. No se encontró un usuario asociado.`);
                }
            } catch (error) {
                console.error(`Error al procesar el archivo ${file}:`, error);
            }
        }

        await app.close();
        console.log('Migración completada.');
    } catch (error) {
        console.error('Error fatal al iniciar la aplicación o durante la migración:', error);
    }
}

bootstrap();
