import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatInterceptorInterceptor } from './interceptor/formatInterceptor.interceptor';
import { CustomExceptionFilter } from './util/custom-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatInterceptorInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useStaticAssets('uploads', {
    prefix: '/uploads', // 可选的 URL 前缀
  });
  await app.listen(3000);
}
bootstrap();
