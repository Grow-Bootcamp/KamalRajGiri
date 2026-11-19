import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })),


    app.enableCors({
      origin: /^http:\/\/localhost:\d+$/,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    });

    const port =  process.env.PORT ?? 3000;

  await app.listen(port);
  console.log(`Server running at http://localhost:${3000}`);
}
await bootstrap();
