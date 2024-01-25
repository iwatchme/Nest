import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.126.com',
      port: 25,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get<string>('EMAIL_USER'),
      },
      to,
      subject,
      html,
    });
  }
}
