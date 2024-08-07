import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api')

  const configService = app.get(ConfigService)

  const HOST = configService.get('API_HOST')
    ? configService.get('API_HOST')
    : '0.0.0.0'
  await app.listen(configService.get('PORT') || 6000, HOST);
}
bootstrap();
