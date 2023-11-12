import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';

// !other import
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1/');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.verbose(`Server started on ${await app.getUrl()}`);
}
bootstrap();
