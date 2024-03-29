import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://localhost:4173'],
      credentials: true,
    }),
  );
  // app.enableCors({ credentials: true });
  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
