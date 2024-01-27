import { Controller, Get, Inject, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { setMaxIdleHTTPParsers } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Get()
  @SetMetadata('needLogin', true)
  @SetMetadata('requirePermissions', ['dddddd'])
  getHello(): string {
    console.log(`${this.configService.get('DATABASE_URL')}`);
    return this.appService.getHello();
  }
}
