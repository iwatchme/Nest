import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Get()
  getHello(): string {
    console.log(`${this.configService.get('DATABASE_URL')}`);
    return this.appService.getHello();
  }
}
