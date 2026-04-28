import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const appName = 'OncoMente';
    const subject = `${appName} — Redefinição de senha`;
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#9B5DE0;">Redefinição de senha</h2>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta <strong>${appName}</strong>.</p>
        <p>Copie o código completo abaixo e cole no campo indicado no aplicativo:</p>
        <div style="background:#F3E8FF;border-radius:8px;padding:16px 24px;margin:24px 0;word-break:break-all;">
          <span style="font-size:13px;font-family:monospace;color:#4C1D95;line-height:1.6;">${token}</span>
        </div>
        <p style="color:#6b7280;font-size:13px;">Este código expira em <strong>15 minutos</strong>. Se você não solicitou a redefinição, ignore este e-mail.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;">Equipe ${appName} &mdash; suporte@oncomente.com</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Reset password email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send reset password email to ${to}`, err);
      throw err;
    }
  }
}
