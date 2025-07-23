import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('UJCV Schedule Manager')
    .setDescription('API documentation for UJCV Schedule Manager')
    .setVersion('0.2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS for frontend
  app.enableCors(
    //   {
    //   origin: 'http://172.17.11.65:5173',
    //   credentials: true,
    // }

  );

  const port = Number(process.env.PORT || envs.port || 3000);
  await app.listen(port, '0.0.0.0');

  logger.log(`>Server is running at http://localhost:${port}`);
  logger.log(`>Swagger is available at http://localhost:${port}/api`);
}
bootstrap();
