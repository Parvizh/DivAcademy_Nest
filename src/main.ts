import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const configService = app.get(ConfigService)

  const config = new DocumentBuilder()
    .setTitle('E-commerce')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('e-commerce')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  const HOST = configService.get('API_HOST')
    ? configService.get('API_HOST')
    : '0.0.0.0'
  await app.listen(configService.get('PORT') || 3000, HOST);
}
bootstrap();
