import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission } from './util/custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Get()
  @RequireLogin()
  @RequirePermission('ccccc')
  getHello(): string {
    console.log(`${this.configService.get('DATABASE_URL')}`);
    return this.appService.getHello();
  }
}
