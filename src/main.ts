import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Classes Microservice')
    .setDescription('The classes API description')
    .setVersion('1.0')
    .addTag('classes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  logger.log(`Class Microservice running on port ${envs.port}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
