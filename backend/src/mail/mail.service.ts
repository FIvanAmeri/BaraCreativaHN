import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { TransactionDetails } from '../interfaces/transaction-details.interface';

export interface PurchaseNotificationData {
  userName: string;
  userEmail: string;
  courseTitle: string;
  paymentAmount: number;
  orderId: string;
  transactionDetails: TransactionDetails;
  tipoUsuario: 'Alumno' | 'Empresa' | 'Instructor' | 'Admin';
  cursosComprados: string[];
  totalComprados: number;
  porcentajeComprados: number;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Envía un correo de recibo de compra al cliente.
   */
  async sendPurchaseReceiptToCustomer(
    userEmail: string,
    userName: string,
    courseTitle: string,
    paymentAmount: number,
    orderId: string,
    transactionDetails: TransactionDetails,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: `Gracias por tu compra, ${userName}!`,
        template: 'purchase-receipt-user',
        context: {
          customerName: userName,
          courseTitle,
          paymentAmount,
          orderId,
          transactionId: transactionDetails?.id ?? '',
          captureTime: transactionDetails?.create_time ?? '',
          currency: 'USD',
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Recibo de compra enviado a: ${userEmail}`);
    } catch (error) {
      this.logger.error('Error al enviar el recibo de compra:', error.message, error.stack);
    }
  }

  /**
   * Envía un correo de notificación de compra al administrador.
   */
  async sendPurchaseNotificationToAdmin(data: PurchaseNotificationData): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: this.configService.get<string>('EMAIL_USER'),
        subject: `Nueva compra de ${data.userName} - ${data.courseTitle}`,
        template: 'purchase-notification-admin',
        context: {
          ...data,
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Notificación de compra enviada al administrador`);
    } catch (error) {
      this.logger.error('Error al enviar la notificación de compra:', error.message, error.stack);
    }
  }

  async sendVerificationEmail(to: string, nombre: string, enlace: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: 'Verifica tu cuenta de BaraCreativa',
        template: 'verificacion-correo',
        context: {
          nombre,
          enlace,
        },
      });
      this.logger.log(`Correo de verificación enviado a: ${to}`);
    } catch (error) {
      this.logger.error('Error al enviar el correo de verificación:', error.message, error.stack);
      throw new InternalServerErrorException('No se pudo enviar el correo de verificación.');
    }
  }

  async sendPasswordRecoveryEmailToUser(
    userEmail: string,
    userName: string,
    token: string,
    enlace: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: `Recuperación de Contraseña`,
        template: 'password-recovery',
        context: {
          nombre: userName,
          token: token,
          enlace: enlace,
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Correo de recuperación enviado con éxito a: ${userEmail}`);
    } catch (error) {
      this.logger.error('Error al enviar el correo de recuperación:', error.message, error.stack);
      throw new InternalServerErrorException('No se pudo enviar el correo de recuperación.');
    }
  }

  async sendPasswordRecoveryNotificationToAdmin(
    adminEmail: string,
    userEmail: string,
    userName: string,
    recoveryCode: string,
  ): Promise<void> {
    const html = `
      <p>Se ha solicitado una recuperación de contraseña para el usuario:</p>
      <ul>
        <li>Nombre: ${userName}</li>
        <li>Correo: ${userEmail}</li>
        <li>Código de recuperación: ${recoveryCode}</li>
      </ul>
    `;
    
    try {
      await this.mailerService.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: adminEmail,
        subject: 'Notificación de recuperación de contraseña',
        html,
      });
      this.logger.log(`Notificación de recuperación enviada al administrador: ${adminEmail}`);
    } catch (error) {
      this.logger.error('Error al enviar la notificación de recuperación:', error.message, error.stack);
    }
  }
}
