import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fastifyMultipart from '@fastify/multipart';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );


  
  app.register(fastifyMultipart, {
    addToBody: true,
    limits: {
      fileSize: 15 * 1024 * 1024,
    },
  });
  await app.listen(3000);
}
bootstrap();
